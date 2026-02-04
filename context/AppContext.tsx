"use client"

import React, { createContext, useState, useEffect, useContext } from 'react'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Nasabah, NasabahService } from '@/lib/NasabahService'
import { JenisSampah, JenisSampahService } from '@/lib/JenisSampahService'

interface Settings {
    currency: string
    appLogo?: string | null
}

interface AppContextType {
    jenisSampah: JenisSampah[]
    nasabah: Nasabah[]
    settings: Settings
    loading: boolean
    getNasabahById: (id: string) => Nasabah | null
    getJenisSampahById: (id: string) => JenisSampah | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [jenisSampah, setJenisSampah] = useState<JenisSampah[]>([])
    const [nasabah, setNasabah] = useState<Nasabah[]>([])
    const [settings, setSettings] = useState<Settings>({
        currency: 'Rp',
        appLogo: null
    })
    const [loading, setLoading] = useState(true)

    // Load settings from Firestore
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settingsSnapshot = await getDocs(collection(db, 'settings'))
                if (!settingsSnapshot.empty) {
                    const firebaseSettings = settingsSnapshot.docs[0].data() as Settings
                    setSettings({
                        currency: firebaseSettings.currency || 'Rp',
                        appLogo: firebaseSettings.appLogo || null
                    })
                }
            } catch (error) {
                console.error("Error loading settings:", error)
            } finally {
                setLoading(false)
            }
        }

        loadSettings()
    }, [])

    // Subscribe to jenis_sampah collection
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'jenis_sampah'),
            (snapshot) => {
                const data: JenisSampah[] = snapshot.docs.map(doc => JenisSampahService.mapDoc(doc))
                setJenisSampah(data)
            },
            (error) => console.error("Error listening to jenis_sampah:", error)
        )

        return () => unsubscribe()
    }, [])

    // Subscribe to nasabah collection
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'nasabah'),
            (snapshot) => {
                const data: Nasabah[] = snapshot.docs.map(doc => NasabahService.mapDoc(doc))

                // Remove duplicates based on custom ID
                const uniqueData = data.reduce((acc: Nasabah[], current) => {
                    const existing = acc.find(item => item.id === current.id)
                    if (!existing) {
                        acc.push(current)
                    }
                    return acc
                }, [])

                setNasabah(uniqueData)
            },
            (error) => console.error("Error listening to nasabah:", error)
        )

        return () => unsubscribe()
    }, [])

    // Helper function to get nasabah by ID
    const getNasabahById = (id: string): Nasabah | null => {
        if (!id) return null
        return nasabah.find(n => n.id === id || n.firestoreId === id) || null
    }

    // Helper function to get jenis sampah by ID
    const getJenisSampahById = (id: string): JenisSampah | null => {
        if (!id) return null
        return jenisSampah.find(s => s.id === id || s.firestoreId === id) || null
    }

    return (
        <AppContext.Provider
            value={{
                jenisSampah,
                nasabah,
                settings,
                loading,
                getNasabahById,
                getJenisSampahById
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
