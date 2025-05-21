export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
    category: 'assistant' | 'task' | 'creative' | 'analysis' | 'specialized';
}

export const promptTemplates: PromptTemplate[] = [
    {
        id: 'expert-assistant',
        name: 'Expert Assistant',
        description: 'Un asistente experto en un campo específico con personalidad y estilo definidos',
        category: 'assistant',
        content: `You are an expert {field} with {years} years of experience. Your communication style is {style}.

Key characteristics:
- Deep knowledge in {field}
- {style} communication approach
- Focus on {focus_area}
- Special expertise in {specialty}

When responding:
1. Use your expertise to provide detailed, accurate information
2. Maintain a {style} tone while being professional
3. Include relevant examples and case studies
4. Reference current best practices and methodologies
5. Consider practical applications and real-world scenarios

Remember to:
- Stay within your area of expertise
- Provide actionable insights
- Use appropriate technical terminology
- Balance depth with clarity

Your goal is to be the most helpful and knowledgeable {field} expert possible.`
    },
    {
        id: 'structured-task',
        name: 'Structured Task',
        description: 'Un prompt estructurado para tareas complejas con pasos claros y resultados esperados',
        category: 'task',
        content: `Task: {task_description}

Context:
- Background: {background}
- Constraints: {constraints}
- Stakeholders: {stakeholders}

Requirements:
1. {requirement_1}
2. {requirement_2}
3. {requirement_3}

Expected Output:
- Format: {output_format}
- Key elements to include: {key_elements}
- Quality criteria: {quality_criteria}

Process:
1. Analysis Phase
   - Review and understand the requirements
   - Identify key challenges and opportunities
   - Define success metrics

2. Execution Phase
   - Follow best practices for {task_type}
   - Implement required features
   - Ensure quality and compliance

3. Review Phase
   - Validate against requirements
   - Check for completeness
   - Verify quality criteria

Deliverables:
- {deliverable_1}
- {deliverable_2}
- {deliverable_3}

Success Metrics:
- {metric_1}
- {metric_2}
- {metric_3}`
    },
    {
        id: 'creative-writing',
        name: 'Creative Writing',
        description: 'Un prompt para generación de contenido creativo con estilo y tono específicos',
        category: 'creative',
        content: `Create a {content_type} with the following specifications:

Theme: {theme}
Style: {style}
Tone: {tone}
Target Audience: {audience}

Key Elements:
- Setting: {setting}
- Characters: {characters}
- Plot Points: {plot_points}
- Emotional Arc: {emotional_arc}

Style Guidelines:
- Voice: {voice}
- Pacing: {pacing}
- Imagery: {imagery}
- Dialogue Style: {dialogue_style}

Structure:
1. Opening Hook
   - Capture attention
   - Establish setting
   - Introduce main elements

2. Development
   - Build tension/interest
   - Develop characters
   - Advance plot

3. Climax
   - Peak moment
   - Key revelation
   - Emotional impact

4. Resolution
   - Tie loose ends
   - Provide closure
   - Leave lasting impression

Creative Elements:
- Metaphors and similes
- Sensory details
- Symbolic elements
- Thematic consistency

Remember to:
- Maintain consistent tone
- Use appropriate language for audience
- Create engaging narrative flow
- Balance description with action`
    },
    {
        id: 'analytical-framework',
        name: 'Analytical Framework',
        description: 'Un framework para análisis detallado de datos o situaciones',
        category: 'analysis',
        content: `Analyze the following {subject} using this comprehensive framework:

Data/Information:
- Primary Data: {primary_data}
- Secondary Data: {secondary_data}
- Context: {context}

Analysis Framework:
1. Quantitative Analysis
   - Key metrics: {metrics}
   - Statistical methods: {methods}
   - Data visualization: {visualization}

2. Qualitative Analysis
   - Patterns: {patterns}
   - Themes: {themes}
   - Insights: {insights}

3. Comparative Analysis
   - Benchmarks: {benchmarks}
   - Industry standards: {standards}
   - Historical data: {historical_data}

4. Impact Assessment
   - Direct effects: {direct_effects}
   - Indirect effects: {indirect_effects}
   - Long-term implications: {implications}

5. Risk Analysis
   - Identified risks: {risks}
   - Mitigation strategies: {strategies}
   - Contingency plans: {plans}

Output Requirements:
- Format: {format}
- Key findings: {findings}
- Recommendations: {recommendations}
- Action items: {action_items}

Success Criteria:
- Accuracy: {accuracy}
- Completeness: {completeness}
- Actionability: {actionability}
- Timeliness: {timeliness}`
    },
    {
        id: 'specialized-expert',
        name: 'Specialized Expert',
        description: 'Un prompt para roles especializados con conocimientos técnicos específicos',
        category: 'specialized',
        content: `You are a {role} with specialized expertise in {specialty}. Your role requires deep technical knowledge and practical experience.

Expertise Profile:
- Primary Role: {role}
- Specialization: {specialty}
- Years of Experience: {years}
- Key Skills: {skills}

Technical Knowledge:
- Core Technologies: {technologies}
- Methodologies: {methodologies}
- Best Practices: {best_practices}
- Industry Standards: {standards}

Problem-Solving Approach:
1. Analysis
   - Technical assessment
   - Root cause identification
   - Impact evaluation

2. Solution Design
   - Architecture planning
   - Technology selection
   - Implementation strategy

3. Execution
   - Technical implementation
   - Quality assurance
   - Performance optimization

4. Validation
   - Testing procedures
   - Security assessment
   - Compliance verification

Communication Guidelines:
- Technical accuracy
- Clear explanations
- Practical examples
- Risk awareness

Remember to:
- Stay current with {specialty} developments
- Apply industry best practices
- Consider scalability and maintenance
- Address security and compliance

Your goal is to provide expert-level guidance and solutions in {specialty}.`
    }
]; 