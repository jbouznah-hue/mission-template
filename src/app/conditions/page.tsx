import { siteConfig } from '@/config/site';
import { definitions } from '@/config/definitions';

export default function Conditions() {
  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-xs font-medium mb-4">
          {definitions.concepts.chiffrage.nom}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Conditions</h1>
        <p className="text-[var(--color-text-secondary)]">
          {definitions.concepts.chiffrage.definition}
        </p>
      </section>

      {/* Investment */}
      <section className="card">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6">Investissement</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 rounded-xl bg-[var(--color-primary-bg)]">
            <div className="text-3xl font-bold text-[var(--color-primary)]">{"5 000 ₪"}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">HT / mois</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gray-50">
            <div className="text-3xl font-bold text-[var(--color-dark)]">{"12"}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">mois d&apos;engagement</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gray-50">
            <div className="text-3xl font-bold text-[var(--color-dark)]">{"60 000 ₪"}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">Total HT</div>
          </div>
        </div>

        <table className="table-mission">
          <thead>
            <tr>
              <th>Poste</th>
              <th>Montant</th>
              <th>Détail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Forfait mensuel</td>
              <td>{"5 000 ₪"} HT</td>
              <td className="text-[var(--color-text-secondary)]">{"Accompagnement 360 incluant 4h de conseil/mois"}</td>
            </tr>
            <tr>
              <td className="font-medium">Setup / Installation</td>
              <td>{"Offert"}</td>
              <td className="text-[var(--color-text-secondary)]">{"Inclus avec engagement 12 mois"}</td>
            </tr>
            <tr>
              <td className="font-medium">Conseil supplémentaire</td>
              <td>{"350 ₪"} HT/h</td>
              <td className="text-[var(--color-text-secondary)]">Au-delà des heures incluses</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Exclusions */}
      <section className="card">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">Frais à charge du client</h2>
        <ul className="space-y-2">
          {[
            'Budgets publicitaires Meta, TikTok, Google (payés directement par le client)',
            'Production photo/vidéo professionnelle',
            'Abonnements outils tiers (emailing, API WhatsApp ~200 ₪/mois)',
            'Impressions physiques et traductions hors FR/HE',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-light)] mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* IP */}
      <section className="card">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">Propriété intellectuelle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[var(--color-dark)] mb-2">Pendant le contrat</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {"Le code source et les outils développés restent la propriété d'ORRTYL pendant la durée du contrat."}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-dark)] mb-2">Après le contrat</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {"À l'issue du contrat et après paiement intégral, le client reçoit l'accès complet au code source, aux templates et à la documentation."}
            </p>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="card">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">Modalités de paiement</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-secondary)]">Acompte à la signature</span>
            <span className="font-semibold">{"10 000 ₪ HT (1er + dernier mois)"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-secondary)]">Périodicité</span>
            <span className="font-semibold">{"Mensuel, en début de mois"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-secondary)]">Délai de paiement</span>
            <span className="font-semibold">{"7 jours nets"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-secondary)]">Pénalités de retard</span>
            <span className="font-semibold">{"1,5% mensuel"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--color-text-secondary)]">Entité de facturation</span>
            <span className="font-semibold">{siteConfig.entity.name} (N° {siteConfig.entity.siret})</span>
          </div>
        </div>
      </section>
    </div>
  );
}
