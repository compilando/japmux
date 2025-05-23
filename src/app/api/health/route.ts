import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificaciones básicas de salud
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '2.0.2',
      checks: {
        api: 'ok',
        memory: process.memoryUsage(),
      }
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// También responder a HEAD requests para health checks más ligeros
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 