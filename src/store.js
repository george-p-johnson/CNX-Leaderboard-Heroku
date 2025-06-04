import { reactive } from 'vue';

export const store = reactive({
  entries: [],       // Ensure it's always an array
  donation: 0        // Default donation value
});