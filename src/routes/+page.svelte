<script lang="ts">
  import { onMount } from "svelte";

    // mock data
    let data = []

    let searched = null;

    let page = 1;
    let i = 0;

    onMount(async () => {
        const res = await fetch('/api/v1/data');
        data = await res.json();
    });

    async function next() {
        if (page < data.pages) {
            page++;
            i = (page - 1) * 25;
        }

        const res = await fetch(`/api/v1/data?page=${page}`);
        data = await res.json();
    }

    async function prev() {
        if (page > 1) {
            page--;
            i = (page - 1) * 25;
        }

        const res = await fetch(`/api/v1/data?page=${page}`);
        data = await res.json();
    }
</script>

<div class="flex flex-col w-full min-full min-h-screen bg-base">
    <h1 class="mx-auto mt-2 p-2 text-center flex">
        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="72" width="72">
        <span class="ml-2 flex flex-col my-auto">
            <span class="text-6xl font-bold">Doubloons</span>
            <span class="text-start text-sm ml-1 text-muted">(actual doubloon data, for opted-in people)</span>
        </span>
    </h1>

    <div class="p-3 shadow-md rounded-lg mx-auto mt-4 mb-8 mx-2 md:mx-8 h-full bg-surface">
        <div class="flex flex-col md:flex-row mb-4">
            <div>
                <h2 class="text-4xl font-semibold">Leaderboard</h2>
                <p class="text-lg text-muted mt-2 md:mt-0">
                    Opt-in/out at
                    <a href="https://highseas.hackclub.com/signpost" class="text-blue">The Signpost</a>!
                </p>
            </div>
            <div class="ml-auto flex h-fit">
                <input 
                type="text" 
                class="text-lg w-full p-2 rounded-lg outline-none border border-border transition-all duration-300 bg-base" 
                placeholder="Enter username"
            >
                <button 
                    class="bg-red text-lg text-white p-2 rounded-lg ml-2"
                    on:click={async () => {
                        searched = data.users.find(user => user.username == document.querySelector('input').value);
                        
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
            <div class="flex p-2 bg-yellow/10 rounded-tl-md rounded-tr-md mt-2">
                <p class="text-2xl my-auto font-semibold mr-6">#{data.users.indexOf(searched) + 1}</p>

                <img src={`https://cachet.dunkirk.sh/users/${searched.id}/r`} class="rounded-full" height="48" width="48" alt="profile_picture" />
                <h1 class="text-2xl my-auto font-semibold ml-2 mr-10">@{searched.username}</h1>
                <p class="ml-auto text-2xl my-auto font-semibold flex">
                    <span class="my-auto mr-1">{searched.doubloons}</span>
                    <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="24" width="24">
                </p>
            </div>
        {/if}

        {#each data.users as user, i} 
            <div class={`flex p-2 ${(i + (page - 1) * 25) % 2 == 0 ? '' : 'bg-base'}`}>
                <p class="text-2xl my-auto font-semibold mr-6">#{i + ((page - 1) * 25) + 1}</p>

                <img src={`https://cachet.dunkirk.sh/users/${user.id}/r`} class="rounded-full" height="48" width="48" alt="profile_picture" />
                <h1 class="text-2xl my-auto font-semibold ml-2 mr-10">@{user.username}</h1>
                <p class="ml-auto text-2xl my-auto font-semibold flex">
                    <span class="my-auto mr-1">{user.doubloons}</span>
                    <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="24" width="24">
                </p>
            </div>  
        {/each}

        <div class="flex justify-center mt-4 mb-2">
            <button 
                class="bg-blue text-lg text-white p-2 rounded-lg"
                on:click={() => prev()}
            >
                Back
            </button>

            <span class="text-2xl font-semibold mx-4 my-auto">
                {page}/{data.pages}
            </span>

            <button 
                class="bg-blue text-lg text-white p-2 rounded-lg"
                on:click={() => next()}
            >
                Next
            </button>
        </div>
    </div>
</div>