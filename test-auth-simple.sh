#!/bin/bash

echo "=== Test du système d'authentification ==="
echo ""

# Test 1: Créer les utilisateurs de test
echo "1. Création des utilisateurs de test..."
curl -s -X POST http://localhost:8000/api/test/create-users \
  -H "Content-Type: application/json" | jq .message 2>/dev/null || echo "Utilisateurs créés"

echo ""

# Test 2: Tester le login client
echo "2. Test login client..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"password123"}')

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Login client réussi"
else
    echo "❌ Login client échoué: $LOGIN_RESPONSE"
fi

echo ""

# Test 3: Tester le logout (nécessite une session active)
echo "3. Test logout..."
LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/logout \
  -H "Content-Type: application/json")

if echo "$LOGOUT_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Logout réussi"
else
    echo "❌ Logout échoué: $LOGOUT_RESPONSE"
fi

echo ""
echo "=== Test terminé ==="
echo ""
echo "Pour tester manuellement:"
echo "- Frontend: http://localhost:5173/auth-test"
echo "- Login: http://localhost:5173/login"
echo "- Comptes: client@test.com, agency@test.com, admin@test.com / password123"