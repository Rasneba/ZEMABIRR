import { BRAND } from "@/lib/brand";

export const metadata = { title: `Privacy Policy — ${BRAND.name}` };

const SECTIONS = [
  ["Information we collect", "We collect your phone number, username, transaction records and gameplay history in order to provide our services, process payments and comply with legal obligations."],
  ["How we use information", "Your data is used to operate your account, process deposits and withdrawals, prevent fraud, provide customer support, and send you promotions you have opted into."],
  ["Cookies", "We use essential cookies to keep you logged in and remember your preferences. We do not sell your personal data."],
  ["Data security", "We use industry-standard encryption and password hashing. Access to personal data is restricted to authorized staff."],
  ["Your rights", `You may request access to, correction of, or deletion of your personal data by contacting ${BRAND.email}.`],
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 rounded-2xl bg-card p-6 sm:p-10">
      <h1 className="text-3xl font-black">Privacy Policy</h1>
      {SECTIONS.map(([h, p]) => (
        <section key={h}><h2 className="mb-1 font-bold">{h}</h2><p className="text-sm leading-relaxed text-mute">{p}</p></section>
      ))}
    </article>
  );
}
