interface Participant {
  _id: string;
  nickname: string;
  isHost: boolean;
  score: number;
}

interface ParticipantListProps {
  participants: Participant[];
  showScores?: boolean;
}

export default function ParticipantList({
  participants,
  showScores = false,
}: ParticipantListProps) {
  const players = participants.filter((p) => !p.isHost);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm font-medium">
        {players.length} player{players.length !== 1 ? "s" : ""} joined
      </p>
      <div className="max-h-48 overflow-y-auto flex flex-wrap gap-2">
        {players.map((p) => (
          <div
            key={p._id}
            className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5"
          >
            <span className="text-sm font-medium text-foreground">{p.nickname}</span>
            {showScores && (
              <span className="text-xs text-muted-foreground">{p.score} pts</span>
            )}
          </div>
        ))}
        {players.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            Waiting for players to join…
          </p>
        )}
      </div>
    </div>
  );
}
