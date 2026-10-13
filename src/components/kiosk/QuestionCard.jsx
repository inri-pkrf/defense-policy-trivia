export default function QuestionCard({ question }) {
  return (
    <article
      className="w-full max-w-6xl z-30"
      aria-label="שאלה"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-blue-100 text-center mx-auto">
        <h2 className="text-3xl font-bold text-blue-950 leading-snug">{question.question}</h2>
      </div>
    </article>
  );
}