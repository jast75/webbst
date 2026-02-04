'use client';

import React from 'react';
import { CldImage } from 'next-cloudinary';

interface TeamMember {
    id: number;
    publicID: string;
    name: string;
    role: string;
}

const teamMembers: TeamMember[] = [
    {
        id: 1,
        publicID: 'Iman-nobg_thnvlq',
        name: 'Iman Tri Prakoso',
        role: 'Penanggung Jawab',
    },
    {
        id: 2,
        publicID: 'Suyanto-nobg_pahnaf',
        name: 'Suyanto',
        role: 'Ketua',
    },
    {
        id: 3,
        publicID: 'Ika-Prihartini-nobg_ovd9ah',
        name: 'Ika Prihartini',
        role: 'Sekretaris',
    },
    {
        id: 4,
        publicID: 'dewi-2-nobg_uadzwg',
        name: 'Dewi Wahyuningsih',
        role: 'Bendahara',
    },
    {
        id: 5,
        publicID: 'nuraisah-nobg_fqg5hj',
        name: 'Nuraisah',
        role: 'Bendahara',
    },
    {
        id: 6,
        publicID: 'Dian_Wahida-nobg_fsnaip',
        name: 'Wahida Dian Aprilia',
        role: 'Anggota',
    },
    {
        id: 7,
        publicID: 'Santi-Astuti-nobg_y5u0vf',
        name: 'Santi Astuti',
        role: 'Anggota',
    },
    {
        id: 8,
        publicID: 'Nurmala-nobg_pngs6u',
        name: 'Nurmala',
        role: 'Anggota',
    },
    {
        id: 9,
        publicID: 'Mujiadi-nobg_zbk2te',
        name: 'Mujiadi',
        role: 'Anggota',
    },
    {
        id: 10,
        publicID: 'jati_satrio-nobg_ohv3sf',
        name: 'Jati Satrio Tomo',
        role: 'Anggota',
    },
];

const MemberCard = ({ member }: { member: TeamMember }) => (
    <div className="flex flex-col text-center">
        <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-4 overflow-hidden relative group">
            <CldImage
                src={member.publicID}
                alt={member.name}
                width={300}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                crop="fill"
                gravity="face"
            />
        </div>
        <h4 className="text-lg font-bold leading-tight">{member.name}</h4>
        <p className="text-primary font-medium text-xs mt-1">{member.role}</p>
    </div>
);

export default function TeamGrid() {
    const topTwo = teamMembers.slice(0, 2);
    const middleFour = teamMembers.slice(2, 6);
    const bottomFour = teamMembers.slice(6, 10);

    return (
        <section className="py-20" id="tim">
            <div className="text-center mb-16 px-4">
                <h2 className="text-3xl md:text-4xl font-black mb-4">Sosok di Balik Layar</h2>
                <p className="opacity-70">Para penggerak yang mendedikasikan waktu mereka untuk bumi yang lebih hijau.</p>
            </div>

            <div className="flex flex-col gap-10 max-w-4xl mx-auto px-4">
                {/* Top 2 - Centered */}
                <div className="flex flex-wrap justify-center gap-6">
                    {topTwo.map((member) => (
                        <div key={member.id} className="w-1/2 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                            <MemberCard member={member} />
                        </div>
                    ))}
                </div>

                {/* Middle 4 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {middleFour.map((member) => (
                        <MemberCard key={member.id} member={member} />
                    ))}
                </div>

                {/* Bottom 4 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {bottomFour.map((member) => (
                        <MemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
