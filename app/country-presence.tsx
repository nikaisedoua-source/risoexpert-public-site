const countries = [
  {
    code: "CI",
    flag: "🇨🇮",
    name: "Côte d’Ivoire",
    label: "Base technique & interventions",
    cities: ["Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro", "Korhogo", "Toutes les villes"],
  },
  {
    code: "CM",
    flag: "🇨🇲",
    name: "Cameroun",
    label: "Assistance & déploiement",
    cities: ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Bamenda", "Toutes les villes"],
  },
];

export default function CountryPresence() {
  return (
    <section className="countryPresence" aria-labelledby="presence-title">
      <div className="shell">
        <div className="countryIntro">
          <div>
            <p className="kicker gold">Une expertise, deux pays</p>
            <h2 id="presence-title">RisoExpert traverse les frontières.</h2>
          </div>
          <p>
            Un même standard de diagnostic, de suivi et de maintenance pour les
            professionnels de Côte d’Ivoire et du Cameroun.
          </p>
        </div>
        <div className="countryCards">
          {countries.map((country) => (
            <article className={`countryCard country${country.code}`} key={country.code}>
              <div className="countryTop">
                <span className="countryFlag" aria-hidden="true">{country.flag}</span>
                <div>
                  <p>{country.label}</p>
                  <h3>{country.name}</h3>
                </div>
                <b>{country.code}</b>
              </div>
              <div className="cityList">
                {country.cities.map((city) => <span key={city}>{city}</span>)}
              </div>
            </article>
          ))}
        </div>
        <div className="countryPromise">
          <strong>Diagnostic à distance partout</strong>
          <span>Intervention et déplacement confirmés selon la ville, l’urgence et la disponibilité technique.</span>
          <a href="#demande">Choisir mon pays et demander une assistance →</a>
        </div>
      </div>
    </section>
  );
}
