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

export default function PlayerWaiting({ quizTitle, nickname, participants }: PlayerWaitingProps) {
  const players = participants.filter((p) => !p.isHost);

  return (
    <div className="max-w-lg mx-auto px-6 pt-16 pb-20 flex flex-col items-center">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-xl font-black text-background mb-3">
        {nickname.charAt(0).toUpperCase()}
      </div>
      <p className="text-lg font-bold tracking-tight">{nickname}</p>
      <span className="font-mono text-xs text-muted-foreground mt-0.5">that&apos;s you</span>

      {/* Quiz title */}
      <div className="text-center mt-10 mb-8">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Joined
        </span>
        <h1 className="text-xl font-bold tracking-tight mt-1">{quizTitle}</h1>
      </div>

      {/* Waiting indicator */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm font-mono text-muted-foreground">
          Waiting for the host to start…
        </p>
      </div>

      {/* Players */}
      <div className="w-full bg-card border border-border rounded-xl p-5">
        <p className="font-mono text-xs text-muted-foreground mb-3">
          {players.length} player{players.length !== 1 ? "s" : ""} in the room
        </p>
        <div className="flex flex-wrap gap-1.5">
          {players.map((p) => (
            <span
              key={p._id}
              className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium font-mono border border-border bg-muted text-foreground"
            >
              {p.nickname}
            </span>
          ))}
          {players.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No other players yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
