<script lang="ts">
    // mock data
    let data = [
        {
            "username": "User1",
            "pfp": "https://i.pravatar.cc/300",
            "doubloons": 2000,
        },
        {
            "username": "User2",
            "pfp": "https://i.pravatar.cc/301",
            "doubloons": 1500,
        },
        {
            "username": "User3",
            "pfp": "https://i.pravatar.cc/302",
            "doubloons": 1000,
        },
        {
            "username": "User4",
            "pfp": "https://i.pravatar.cc/303",
            "doubloons": 500,
        },
        {
            "username": "User5",
            "pfp": "https://i.pravatar.cc/304",
            "doubloons": 250,
        }
    ]

    let searched = null;

    let i = 0;
</script>

<div class="flex flex-col w-full h-screen">
    <h1 class="font-bold text-6xl mx-auto mt-2 p-2 text-center">
        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="96" width="96">
        Doubloons
    </h1>

    <div class="p-3 shadow-md rounded-lg mx-auto mt-4 mb-8 mx-2 md:mx-8 h-full border-muted border">
        <div class="flex">
            <h2 class="text-4xl font-semibold">Leaderboard</h2>
            <div class="ml-auto flex">
                <input 
                type="text" 
                class="w-full p-2 border-muted border rounded-lg outline-none focus:outline-blue transition-all duration-300" 
                placeholder="Enter user ID"
            >
                <button 
                    class="bg-red text-white p-2 rounded-lg ml-2"
                    on:click={async () => {
                        searched = data.find(user => user.username == document.querySelector('input').value);
                        
                        if (!searched) {
                            // Fetch data from API
                        }
                    }}
                >
                    Search
                </button>
            </div>
        </div>

        {#if searched}
            <div class="flex p-2 border-b border-muted bg-yellow/10 mt-2">
                <p class="text-2xl my-auto font-semibold mr-2">#{data.indexOf(searched) + 1} - </p>

                <img src={searched.pfp} class="rounded-full" height="48" width="48" alt="profile" />
                <h1 class="text-2xl my-auto font-bold ml-2">@{searched.username}</h1>
                <p class="ml-auto text-2xl my-auto font-semibold">
                    {searched.doubloons}
                    <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="28" width="28">
                </p>
            </div>
        {/if}

        {#each data as user, i}
            {#if user != searched}
                <div class={`flex p-2 ${i == data.length - 1 ? '' : 'border-b border-muted'}`}>
                    <p class="text-2xl my-auto font-semibold mr-2">#{i + 1} - </p>

                    <img src={user.pfp} class="rounded-full" height="48" width="48" alt="profile" />
                    <h1 class="text-2xl my-auto font-bold ml-2">@{user.username}</h1>
                    <p class="ml-auto text-2xl my-auto font-semibold">
                        {user.doubloons}
                        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="28" width="28">
                    </p>
                </div>  
            {/if}
        {/each}
    </div>
</div>