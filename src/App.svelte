{#if page > 0}
  <button on:click="{ () => { page -= 1; }}">More recent</button>
{/if}

{#await log}
  <div class="loading">Loading. <LilSpinner/></div>
{:then rows}
  {#if rows.length}
    <ul>
      {#each rows as row}
      <li>
        <a href="{row.url}">{row.title} {#if row.star}⭐️️{/if}</a>
        <div class="time">{printDate(row.time)}</div>
        {#if row.star && row.star.trim()}
          <div>{row.star.trim()}</div>
        {/if}
      </li>
      {/each}
    </ul>
    <button on:click="{ () => { page += 1; }}">Back in time</button>
  {:else}
    <div class="loading">All done!</div>
  {/if}
{:catch err}
  There was an error.
{/await}

<script>
  import LilSpinner from 'lil-spinner';

  let page = 0;
  $: log = fetch(`https://alec-reads.glitch.me/page/${page}`)
    .then((res) => res.json())
    .then((rows) => rows.reverse());

  const printDate = function printDate(dateString) {
    const date = new Date(dateString);
    return date.toDateString();
  };
</script>
