@Patch(':name/versions/:versionId/activate') // Assuming this decorator and path exist
activateVersion(@Param('name') name: string, @Param('versionId') versionId: string) {
    // TODO: Find the correct service method for activating a version
    // return this.service.activateVersion(name, versionId); // Comentado - método inexistente
    throw new Error('Activation method not implemented or found in service.'); // Placeholder
}

// Asumiendo que este es el endpoint para crear versiones basado en openapi.json 