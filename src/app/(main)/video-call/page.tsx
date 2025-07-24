import VideoCall from "./_components/video-call-ui";

export default async function VideoCallPage({ searchParams }:{searchParams:{sessionId:string,token:string}}) {
  const { sessionId, token } = await searchParams;

  return <VideoCall sessionId={sessionId} token={token} />;
}