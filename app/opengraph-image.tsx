import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SyntaRay - Beautiful Code Snippets'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #1a1b26, #24283b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    {/* Logo Icon Mockup */}
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            marginRight: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '40px',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        S
                    </div>
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            margin: 0,
                        }}
                    >
                        SyntaRay
                    </h1>
                </div>
                <div
                    style={{
                        fontSize: '32px',
                        color: '#a1a1aa',
                        textAlign: 'center',
                        maxWidth: '800px',
                        lineHeight: 1.4,
                    }}
                >
                    Create beautiful code snippets instantly.
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
