# Output Sorting Implementation

## Feature
Added automatic sorting of scenarios in the output to match the logical activity sequence for better readability.

## Sorting Order
The scenarios are now sorted in the following order:
1. **Role Play** (sequence order: 1)
2. **Think On Your Feet (TOYF)** (sequence order: 1) - sorted alphabetically with Role Play
3. **Group Activity** (sequence order: 2)
4. **Business Case** (sequence order: 3)
5. **Leadership Questionnaire** (sequence order: 4)

## Implementation
Added sorting logic in `convertToGroupedScheduleResult()` method in `scheduler-v2.service.ts`:

```typescript
// Sort assessment groups by sequence order for better viewing
assessmentGroups.sort((a, b) => {
  const getCategoryOrder = (group: any): number => {
    if (group.is_questionnaire_item || group.is_quesionnaire) return 4;
    if (group.is_group_activity) return 2;
    
    const name = (group.name || group.assessment_name || '').toLowerCase();
    if (name.includes('role play') || name.includes('roleplay')) return 1;
    if (name.includes('think') || name.includes('toyf')) return 1;
    if (name.includes('business')) return 3;
    if (name.includes('group')) return 2;
    if (name.includes('questionnaire') || name.includes('leadership')) return 4;
    
    return 999; // Unknown, put at end
  };

  const orderA = getCategoryOrder(a);
  const orderB = getCategoryOrder(b);

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  // If same order, sort alphabetically by name
  return (a.name || '').localeCompare(b.name || '');
});
```

## Logic
1. **Primary Sort**: By sequence order (1-4)
2. **Secondary Sort**: Alphabetically by name (for activities with same sequence order, like Role Play and TOYF)
3. **Unknown Activities**: Placed at the end (order: 999)

## Benefits
- **Consistent Output**: Always shows activities in logical execution order
- **Better UX**: Easier for users to read and understand the schedule flow
- **Matches Requirements**: Reflects the actual sequence: Parallel → Group → Business → Questionnaire

## Example Output Order
```json
{
  "scenarios": [
    { "name": "RolePlay Scenerio 1", ... },      // Order 1
    { "name": "TOYF 1", ... },                    // Order 1
    { "name": "Group Activity Scenario", ... },   // Order 2
    { "name": "Business Case Scenerio 1", ... },  // Order 3
    { "name": "Leadership Questionnaire", ... }   // Order 4
  ]
}
```

## Files Modified
- `backend/src/Modules/class-configration/scheduling/scheduler-v2.service.ts`

