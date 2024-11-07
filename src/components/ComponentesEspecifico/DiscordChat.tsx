import React, { useState } from 'react'
import { Button } from '../ui/button'

const DiscordChat: React.FC = () => {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message) return

    // Enviar el mensaje al webhook de Discord
    try {
      await fetch(
        'https://discord.com/api/webhooks/1303897512150564915/jnxO06U9tA_CCk7hxJN4doZQgVDQbkNe6ONBAu-axp2Y8G1yYG1IJSSw5lWjqc5oEphq',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message,
          }),
        }
      )
      alert('Mensaje enviado exitosamente')
      setMessage('')
    } catch (error) {
      alert('Hubo un error al enviar el mensaje')
      console.error('Error:', error)
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit}>
      <textarea
        className='w-full resize-none rounded-md border border-gray-300 bg-transparent p-2 focus:border-[#e16d3f] focus:outline-none dark:text-white'
        placeholder='Describe el error...'
        rows={3}
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <Button
        className='mt-2 rounded-lg bg-[#f2b76a] px-4 py-1 text-white transition-colors duration-300 hover:bg-[#e16d3f]'
        type='submit'
      >
        Enviar
      </Button>
    </form>
  )
}

export default DiscordChat
