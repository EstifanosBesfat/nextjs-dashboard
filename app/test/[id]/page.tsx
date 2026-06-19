export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <h1> Product Id: {id}</h1>
    )
}