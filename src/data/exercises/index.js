const modules = import.meta.glob('./*/index.js', { eager: true, import: 'default' })
export const exercises = Object.values(modules).flatMap(items => items.map((exercise, i) => ({
  ...exercise,
  relatedExercises: exercise.relatedExercises ?? [items[i - 1], ...items.slice(i + 1, i + 4), items[i - 2], items[i - 3]]
    .filter(Boolean).slice(0, 3).map(item => item.id),
})))
export const exerciseById = Object.fromEntries(exercises.map(exercise => [exercise.id, exercise]))
export const exercisePath = exercise => ({ name: 'exercise', params: { category: exercise.category, slug: exercise.slug } })
export function inCategory(category) { return exercises.filter(exercise => exercise.category === category) }
export function searchExercises(query) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  return exercises.filter(exercise => {
    const text = [exercise.id, exercise.title, exercise.description, ...exercise.keywords].join(' ').toLocaleLowerCase()
    return terms.every(term => text.includes(term))
  })
}
