import ParticipantList from "@/components/game/participant-list";

interface Participant {
  _id: string;
  nickname: string;
  isHost: boolean;
  score: number;
}

interface PlayerWaitingProps {
  quizTitle: string;
  nickname: string;
  participants: Participant[];
}

export default function PlayerWaiting({
  quizTitle,
  nickname,
  participants,
}: PlayerWaitingProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto px-4 py-10">
      {/* Avatar + nickname */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground">
          {nickname.charAt(0).toUpperCase()}
        </div>
        <p className="text-foreground text-xl font-bold">{nickname}</p>
      </div>

      {/* Quiz title */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
          Joined
        </p>
        <h1 className="text-foreground text-2xl font-black">{quizTitle}</h1>
      </div>

      {/* Waiting indicator */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-sm">Waiting for the host to start…</p>
      </div>

      {/* Player count */}
      <div className="w-full bg-card rounded-2xl p-5 border">
        <ParticipantList participants={participants} />
      </div>
    </div>
  );
}
