'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';

import Logo from "@/assets/Logo.png";
import LiveClock from '@/components/LiveClock';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

function HeaderContent() {
  const params = useSearchParams();
  const router = useRouter();

  const cceId = params.get('cce_id');

  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cceId) return;

    const findCceUser = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/cce/${cceId}`);

        if (res.status === 200) {
          setFullname(res.data.full_name ?? res.data);
        }
      } catch (error) {
        console.error(error);

        setFullname("");

        let message = "Unable to load CCE user.";

        if (error.response?.status === 400) {
          message = "Invalid CCE ID.";
        } else if (error.response?.status === 404) {
          message = "CCE user not found.";
        }

        Swal.fire({
          icon: "error",
          title: "Access Error",
          text: message,
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          router.push("/request-loa");
        });
      } finally {
        setLoading(false);
      }
    };

    findCceUser();
  }, [cceId, router]);

  return (
    <div className='w-full gap-2 bg-white px-4 py-2 rounded-md shadow-[0px_3px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center flex-col md:flex-row md:justify-between md:w-4/5 md:max-w-5xl md:h-[5rem]'>
      <div>
        <Image
          src={Logo}
          width={200}
          alt='Logo'
        />
      </div>

      <div className='flex flex-col justify-center items-center md:items-end'>
        <div>
          <h1 className='font-bold roboto'>
            Member <span className='text-[#1E3161]'>Client Care Portal</span>
          </h1>
        </div>

        <div>
          <LiveClock />
        </div>

        {cceId && (
          <div>
            {loading ? (
              <h1 className='text-xs font-bold roboto text-black/70'>
                Loading user...
              </h1>
            ) : fullname ? (
              <h1 className='text-xs font-bold roboto text-black/70'>
                Hello, <span className='text-[#1E3161]'>{fullname}</span>
              </h1>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function HeaderFallback() {
  return (
    <div className='w-full gap-2 bg-white px-4 py-2 rounded-md shadow-[0px_3px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center flex-col md:flex-row md:justify-between md:w-4/5 md:max-w-5xl md:h-[5rem]'>
      <div>
        <Image
          src={Logo}
          width={200}
          alt='Logo'
        />
      </div>

      <div className='flex flex-col justify-center items-center md:items-end'>
        <h1 className='font-bold roboto'>
          Member <span className='text-[#1E3161]'>Client Care Portal</span>
        </h1>

        <LiveClock />
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  );
}