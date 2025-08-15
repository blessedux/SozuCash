const CACHE_NAME = 'sozu-cash-v2'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/sozu-logo.png',
  '/favicon.ico',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      }
    )
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline payments
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-payment-sync') {
    event.waitUntil(doBackgroundPaymentSync())
  }
})

async function doBackgroundPaymentSync() {
  try {
    // Get pending payments from IndexedDB
    const pendingPayments = await getPendingPayments()
    
    for (const payment of pendingPayments) {
      try {
        // Attempt to process payment
        await processPayment(payment)
        // Remove from pending if successful
        await removePendingPayment(payment.id)
      } catch (error) {
        console.error('Failed to process payment:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Placeholder functions for payment processing
async function getPendingPayments() {
  // Implementation would use IndexedDB
  return []
}

async function processPayment(payment) {
  // Implementation would send payment to network
  console.log('Processing payment:', payment)
}

async function removePendingPayment(id) {
  // Implementation would remove from IndexedDB
  console.log('Removing payment:', id)
}
