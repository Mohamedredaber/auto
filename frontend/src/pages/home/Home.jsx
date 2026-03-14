

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div className="hero">
        <div className="container">
          <div className="hero__content">
            <span className="hero__tag">
              <span className="hero__tag-dot"></span>
              Location de voitures au maroc
            </span>

            <h1 className="hero__title">
              Trouvez la voiture parfaite pour votre voyage            </h1>

            <p className="hero__subtitle">
              Comparez les offres des meilleures agences de location et réservez votre véhicule premium en quelques minutes seulement.            </p>

            <div className="hero__actions">
              <button className="btn-primary">Explorer les voitures</button>
              <button className="btn-outline">Demander une démo</button>
            </div>

            <div className="hero__stats">
              <div>
                <div className="hero__stat-value">500+</div>
                <div className="hero__stat-label">Voitures disponibles</div>
              </div>
              <div>
                <div className="hero__stat-value">24/7</div>
                <div className="hero__stat-label">Support client</div>
              </div>
              <div>
                <div className="hero__stat-value">4.9/5</div>
                <div className="hero__stat-label">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home