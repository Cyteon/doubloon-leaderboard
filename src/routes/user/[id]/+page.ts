export async function load({ params }) {
    return {
        props: {
            id: params.id
        }
    };
}