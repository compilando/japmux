// ... existing code ...
include: {
    region: true,
        culturalData: true,
            project: true,
                prompts: {
        select: { name: true, description: true, tacticId: true /* Otros campos necesarios del Prompt */ },
        // TODO: Si necesitas la versión activa, tendrás que obtenerla por separado
        // o ajustar el modelo Tactic para incluirla si es posible.
    }
}
// ... existing code ...

