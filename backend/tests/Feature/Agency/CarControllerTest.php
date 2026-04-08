<?php

namespace Tests\Feature\Agency;

use Tests\TestCase;
use App\Models\User;
use App\Models\Agency;
use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CarControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test agency and user
        $this->agency = Agency::factory()->create();
        $this->user = User::factory()->create([
            'agency_id' => $this->agency->id,
            'role' => 'admin_agency',
        ]);
    }

    // ────────────────────────────────────────────────── INDEX ────────────────────────────────────────────────────

    /**
     * Test listing cars for authenticated user's agency
     */
    public function test_index_returns_paginated_cars(): void
    {
        // Create 15 cars for the user's agency
        Car::factory(15)->create(['agency_id' => $this->agency->id]);

        $response = $this->actingAs($this->user)->getJson('/api/agency/cars');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['*' => ['id', 'brand', 'model', 'price_per_day', 'status', 'cover_image_url']],
                'meta',
            ]);

        $this->assertCount(10, $response->json('data')); // Paginated to 10
    }

    /**
     * Test user only sees their own agency's cars
     */
    public function test_index_returns_only_user_agency_cars(): void
    {
        // Create cars for user's agency
        Car::factory(5)->create(['agency_id' => $this->agency->id]);

        // Create cars for another agency
        $otherAgency = Agency::factory()->create();
        Car::factory(10)->create(['agency_id' => $otherAgency->id]);

        $response = $this->actingAs($this->user)->getJson('/api/agency/cars');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
    }

    /**
     * Test index requires authentication
     */
    public function test_index_requires_authentication(): void
    {
        $response = $this->getJson('/api/agency/cars');
        $response->assertStatus(401);
    }

    /**
     * Test index requires admin_agency role
     */
    public function test_index_requires_admin_agency_role(): void
    {
        $clientUser = User::factory()->create([
            'agency_id' => $this->agency->id,
            'role' => 'client',
        ]);

        $response = $this->actingAs($clientUser)->getJson('/api/agency/cars');
        $response->assertStatus(403)
            ->assertJsonFragment(['message' => "Accès refusé. Rôle 'admin_agency' requis."]);
    }

    // ────────────────────────────────────────────────── STORE ────────────────────────────────────────────────────

    /**
     * Test creating a car with valid data
     */
    public function test_store_creates_car_with_valid_data(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('car.jpg');

        $payload = [
            'brand'                  => 'BMW',
            'model'                  => 'X5',
            'category'               => 'SUV',
            'year'                   => 2024,
            'transmission'           => 'automatic',
            'fuel'                   => 'diesel',
            'seats'                  => 5,
            'doors'                  => 4,
            'price_per_day'          => 450.50,
            'status'                 => 'available',
            'cover_image_url'        => $file,
            'additional_information' => 'Leather seats',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/agency/cars', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'message', 'data'])
            ->assertJsonFragment(['brand' => 'BMW', 'model' => 'X5']);

        $this->assertDatabaseHas('cars', [
            'brand'      => 'BMW',
            'agency_id'  => $this->agency->id,
        ]);

        // Verify car image was created
        $car = Car::where('brand', 'BMW')->first();
        $this->assertTrue($car->coverImage()->exists());
        $this->assertTrue($car->coverImage->is_cover);
    }

    /**
     * Test agency_id is never taken from request body
     */
    public function test_store_forces_user_agency_id(): void
    {
        Storage::fake('public');

        $otherAgency = Agency::factory()->create();
        $file = UploadedFile::fake()->image('car.jpg');

        $payload = [
            'brand'           => 'Toyota',
            'model'           => 'Corolla',
            'category'        => 'Economy',
            'year'            => 2023,
            'transmission'    => 'manual',
            'fuel'            => 'gasoline',
            'seats'           => 5,
            'doors'           => 4,
            'price_per_day'   => 250,
            'status'          => 'available',
            'cover_image_url' => $file,
            'agency_id'       => $otherAgency->id, // Malicious attempt
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/agency/cars', $payload);

        $response->assertStatus(201);

        // Verify car belongs to user's agency, not the one sent in request
        $car = Car::where('brand', 'Toyota')->first();
        $this->assertEquals($this->agency->id, $car->agency_id);
        $this->assertNotEquals($otherAgency->id, $car->agency_id);
    }

    /**
     * Test store validation errors
     */
    public function test_store_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/agency/cars', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['brand', 'model', 'year', 'price_per_day', 'transmission', 'fuel', 'seats', 'doors', 'status', 'cover_image_url']);
    }

    /**
     * Test store validates enum values
     */
    public function test_store_validates_enum_values(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('car.jpg');

        $payload = [
            'brand'            => 'BMW',
            'model'            => 'X5',
            'category'         => 'SUV',
            'year'             => 2024,
            'transmission'     => 'invalid',  // Invalid enum
            'fuel'             => 'diesel',
            'seats'            => 5,
            'doors'            => 4,
            'price_per_day'    => 450,
            'status'           => 'available',
            'cover_image_url'  => $file,
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/agency/cars', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['transmission']);
    }

    /**
     * Test store validates file upload
     */
    public function test_store_validates_image_file(): void
    {
        $payload = [
            'brand'            => 'BMW',
            'model'            => 'X5',
            'category'         => 'SUV',
            'year'             => 2024,
            'transmission'     => 'automatic',
            'fuel'             => 'diesel',
            'seats'            => 5,
            'doors'            => 4,
            'price_per_day'    => 450,
            'status'           => 'available',
            'cover_image_url'  => UploadedFile::fake()->create('document.pdf', 5120), // Invalid
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/agency/cars', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cover_image_url']);
    }

    // ────────────────────────────────────────────────── SHOW ────────────────────────────────────────────────────

    /**
     * Test retrieving single car
     */
    public function test_show_returns_car_details(): void
    {
        $car = Car::factory()->create(['agency_id' => $this->agency->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/agency/cars/{$car->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $car->id, 'brand' => $car->brand]);
    }

    /**
     * Test show returns 404 for non-existent car
     */
    public function test_show_returns_404_for_non_existent_car(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/agency/cars/9999');

        $response->assertStatus(404);
    }

    /**
     * Test user cannot see other agency's cars
     */
    public function test_show_prevents_accessing_other_agency_cars(): void
    {
        $otherAgency = Agency::factory()->create();
        $car = Car::factory()->create(['agency_id' => $otherAgency->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/agency/cars/{$car->id}");

        $response->assertStatus(404);
    }

    // ────────────────────────────────────────────────── UPDATE ────────────────────────────────────────────────────

    /**
     * Test updating car with valid data
     */
    public function test_update_modifies_car_data(): void
    {
        $car = Car::factory()->create(['agency_id' => $this->agency->id]);

        $payload = [
            'price_per_day' => 500.00,
            'status'        => 'reserved',
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/agency/cars/{$car->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['price_per_day' => 500.0, 'status' => 'reserved']);

        $this->assertDatabaseHas('cars', [
            'id'            => $car->id,
            'price_per_day' => 500.00,
            'status'        => 'reserved',
        ]);
    }

    /**
     * Test updating car image
     */
    public function test_update_replaces_cover_image(): void
    {
        Storage::fake('public');

        $car = Car::factory()->create(['agency_id' => $this->agency->id]);
        $oldImage = CarImage::factory()->create([
            'car_id'   => $car->id,
            'is_cover' => true,
        ]);

        $newFile = UploadedFile::fake()->image('new-car.jpg');

        $response = $this->actingAs($this->user)
            ->putJson("/api/agency/cars/{$car->id}", [
                'cover_image_url' => $newFile,
            ]);

        $response->assertStatus(200);

        // Verify old image was deleted
        $this->assertDatabaseMissing('car_images', ['id' => $oldImage->id]);

        // Verify new image was created
        $this->assertTrue($car->fresh()->coverImage()->exists());
    }

    /**
     * Test partial update (only update one field)
     */
    public function test_update_partial_updates_allowed(): void
    {
        $car = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand'     => 'BMW',
            'model'     => 'X5',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/agency/cars/{$car->id}", [
                'brand' => 'Mercedes',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('cars', [
            'id'    => $car->id,
            'brand' => 'Mercedes',
            'model' => 'X5', // Unchanged
        ]);
    }

    /**
     * Test update prevents accessing other agency's cars
     */
    public function test_update_prevents_accessing_other_agency_cars(): void
    {
        $otherAgency = Agency::factory()->create();
        $car = Car::factory()->create(['agency_id' => $otherAgency->id]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/agency/cars/{$car->id}", ['brand' => 'Hacked']);

        $response->assertStatus(404);
    }

    // ────────────────────────────────────────────────── DESTROY ────────────────────────────────────────────────────

    /**
     * Test deleting a car
     */
    public function test_destroy_deletes_car(): void
    {
        $car = Car::factory()->create(['agency_id' => $this->agency->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/agency/cars/{$car->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['success' => true, 'message' => 'Voiture supprimée avec succès.']);

        $this->assertDatabaseMissing('cars', ['id' => $car->id]);
    }

    /**
     * Test destroy deletes associated images
     */
    public function test_destroy_deletes_associated_images(): void
    {
        Storage::fake('public');

        $car = Car::factory()->create(['agency_id' => $this->agency->id]);
        $images = CarImage::factory(3)->create(['car_id' => $car->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/agency/cars/{$car->id}");

        $response->assertStatus(200);

        // Verify all images deleted
        foreach ($images as $image) {
            $this->assertDatabaseMissing('car_images', ['id' => $image->id]);
        }
    }

    /**
     * Test delete prevents accessing other agency's cars
     */
    public function test_destroy_prevents_accessing_other_agency_cars(): void
    {
        $otherAgency = Agency::factory()->create();
        $car = Car::factory()->create(['agency_id' => $otherAgency->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/agency/cars/{$car->id}");

        $response->assertStatus(404);

        // Verify car still exists
        $this->assertDatabaseHas('cars', ['id' => $car->id]);
    }

    /**
     * Test destroy returns 404 for non-existent car
     */
    public function test_destroy_returns_404_for_non_existent_car(): void
    {
        $response = $this->actingAs($this->user)
            ->deleteJson('/api/agency/cars/9999');

        $response->assertStatus(404);
    }
}
