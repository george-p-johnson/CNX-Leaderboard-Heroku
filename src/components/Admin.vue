<template>
  <div id="container">
    <h2>Admin Panel</h2>
<!-- 
    <div id="googleSheets">
        <a href="https://docs.google.com/spreadsheets/d/11VimFdYmwUYX8OVGfhK3vvXtCdvsIj8IWKop1oxaehk/edit?gid=0#gid=0">Link to Leaderboard Google Sheets</a>
        <br>
        <br>
        <a href="https://docs.google.com/spreadsheets/d/1VS8lLYorekpgm6mPdKACbDcn9r_KoguTuuwqDISnFM8/edit?gid=0#gid=0">Link to Dontations Google Sheets</a>
    </div> -->

    <!-- Leaderboard Entries Section -->
    <div class="section">
      <h3>Leaderboard Entries</h3>
      <div id="header">
        <div>Name</div>
        <div>Score</div>
      </div>

      <!-- 5 static input rows -->
      <div id="data" v-for="(entry, index) in entries" :key="index" style="margin-bottom: 10px;">
        <input v-model="entry.name" name="Name" placeholder="Name" />
        <input v-model.number="entry.score" name="Score" placeholder="Score" type="number" />
      </div>
    </div>

    <!-- Donations Section -->
    <div class="section">
      <h3>Donations</h3>
      <div class="donation-input">
        <label for="donation">Total Donations: $</label>
        <input 
          id="donation" 
          v-model.number="donation" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="0.00"
        />
      </div>
    </div>

    <div id="buttonContainer">
      <button @click="saveAll">Save All Data</button>
      <button @click="fetchAll">Refresh All Data</button>
    </div>
  </div>
</template>

<style scoped>
#container {
  margin: 0 auto;
  display: table;
}

h2 {
  text-align: center;
}

#googleSheets {
    margin: 15px auto;
    display: table;
}

h3 {
  text-align: center;
  margin: 20px 0 10px 0;
  color: #333;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

#header {
    display: flex;
    font-weight: bold;
    margin-bottom: 0.5rem;
    left: 50px;
    position: relative;
    gap: 6rem;
}

#data {
  margin: 0 auto;
  display: table;
}

.donation-input {
  text-align: center;
  margin: 15px 0;
}

.donation-input label {
  font-weight: bold;
  margin-right: 10px;
}

.donation-input input {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 120px;
}

#buttonContainer {
  margin-top: 25px;
  text-align: center;
}

button {
  padding: 10px 30px;
  margin: 5px 10px;
  border-radius: 50px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from '../store.js';

const LEADERBOARD_API_URL = 'https://script.google.com/macros/s/AKfycbxsKJvqveL30rKows7CiECYAeyPY2jeC28JLSW7PupuK8gX-wYtqmyEKgNhAmhOfB6P/exec';
const DONATIONS_API_URL = 'https://script.google.com/macros/s/AKfycbxu6UrZQo5_w4_PE6AlGrthJruSzlyhJ-8FHLNFBmw30Q4xC5cgzTr92ZYzocqVFZKRcw/exec';

// Local entries (fixed 5)
const entries = ref([
  { name: '', score: 0 },
  { name: '', score: 0 },
  { name: '', score: 0 },
  { name: '', score: 0 },
  { name: '', score: 0 },
]);

const donation = ref(0);

// Fetch existing leaderboard data from Google Sheet
const fetchEntries = async () => {
  try {
    const response = await fetch(LEADERBOARD_API_URL);
    const data = await response.json();

    // Fill in existing data into our 5 fixed rows
    for (let i = 0; i < entries.value.length; i++) {
      entries.value[i].name = data[i]?.name || '';
      entries.value[i].score = data[i]?.score || 0;
    }

    // Also update the global store for Leaderboard
    store.entries = [...entries.value];
  } catch (err) {
    console.error('Error fetching entries:', err);
  }
};

// Fetch donations data
const fetchDonations = async () => {
  try {
    const response = await fetch(DONATIONS_API_URL);
    const data = await response.json();
    
    // Assuming the API returns an object with a donation amount
    donation.value = data.donation || 0;
    store.donation = donation.value;
  } catch (err) {
    console.error('Error fetching donations:', err);
  }
};

// Save leaderboard entries to Google Sheet
const saveEntries = async () => {
  try {
    const response = await fetch(LEADERBOARD_API_URL, {
      method: 'POST',
      body: JSON.stringify(entries.value),
    });
    const result = await response.json();
    console.log('Entries saved:', result);

    // Update the store so Leaderboard reflects changes
    store.entries = [...entries.value];
  } catch (err) {
    console.error('Error saving entries:', err);
  }
};

// Save donations to Google Sheet
const saveDonations = async () => {
  try {
    const response = await fetch(DONATIONS_API_URL, {
      method: 'POST',
      body: JSON.stringify({ donation: donation.value }),
    });
    const result = await response.json();
    console.log('Donations saved:', result);

    // Update the store so Leaderboard reflects changes
    store.donation = donation.value;
  } catch (err) {
    console.error('Error saving donations:', err);
  }
};

// Combined save function
const saveAll = async () => {
  await Promise.all([saveEntries(), saveDonations()]);
};

// Combined fetch function
const fetchAll = async () => {
  await Promise.all([fetchEntries(), fetchDonations()]);
};

onMounted(fetchAll);
</script>




























<!-- leaderboard -  https://script.google.com/macros/s/AKfycbxsKJvqveL30rKows7CiECYAeyPY2jeC28JLSW7PupuK8gX-wYtqmyEKgNhAmhOfB6P/exec -->

<!-- Donations - https://script.google.com/macros/s/AKfycbxu6UrZQo5_w4_PE6AlGrthJruSzlyhJ-8FHLNFBmw30Q4xC5cgzTr92ZYzocqVFZKRcw/exec -->
