// ... existing code ...
where: { name: promptName },
            // TODO: Determine how to retrieve the active version ID
            // include: { activeVersion: { select: { id: true } } } // Example if relation exists
        });

if (!targetPrompt) {
    throw new Error(`Prompt with name "${promptName}" not found.`);
}

let targetVersionId: string | null = null;

if (useLatestActive) {
    // TODO: Implement logic to find the actual active version ID for targetPrompt
    // targetVersionId = targetPrompt.activeVersion?.id; // Example if relation exists
    console.warn('ServePromptService: Logic to find active version ID is missing.');
    // Temporarily throw error as we cannot proceed without the active version ID
    if (!versionTag) { // Only throw if no specific version fallback is provided
        throw new Error('Cannot determine active version ID for prompt. Logic needs implementation.');
    }
} else if (versionTag) {
    // Find version by tag if not using latest active
    const specificVersion = await this.prisma.promptVersion.findFirst({
        // ... existing code ...
    });
    if (!specificVersion) {
        throw new Error(`Version with tag "${versionTag}" not found for prompt "${promptName}".`);
    }
    targetVersionId = specificVersion.id;
} else {
    // This case should ideally not happen if useLatestActive is true or versionTag is provided
    throw new Error('Invalid state: No version specified and not using latest active.');
}

// Use targetVersionId if found, otherwise error out or handle as needed
if (!targetVersionId) {
    // If we reached here without a versionTag and couldn't find active one
    throw new Error(`Could not determine a version to serve for prompt "${promptName}".`);
}

// Fetch the specific version details using targetVersionId
const versionToServe = await this.prisma.promptVersion.findUnique({
    where: { id: targetVersionId },
    include: {
        translations: { where: { languageCode: languageCode || undefined } }, // Fetch only target language or none
        // Include other relations if needed, like asset links
    },
});

if (!versionToServe) {
    // This should be rare if targetVersionId was validated before
    throw new Error(`Version with ID "${targetVersionId}" not found, though it was expected.`);
}

// ... existing code ...

