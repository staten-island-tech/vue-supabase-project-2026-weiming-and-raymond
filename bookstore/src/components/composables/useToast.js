import { reactive } from 'vue'

const state = reactive({
    toasts: []
})

export function useToast() {
    const remove = (id) => {
        const index = state.toasts.findIndex(t => t.id === id)
        if (index !== -1) {
            state.toasts.splice(index, 1)
        }
    }

    const show = (message, type = 'success', duration = 3000) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : Date.now()

        state.toasts.push({
            id,
            message,
            type,
            duration
        })

        if (duration !== 0) {
            setTimeout(() => remove(id), duration)
        }

        return id
    }

    return {
        state,
        show,
        remove,
        success: (msg, duration) => show(msg, 'success', duration),
        error: (msg, duration) => show(msg, 'error', duration)
    }
}