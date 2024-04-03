"use client"
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import Loader from './Loader';
import { useToast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';


const MeetingType = () => {
    const { toast } = useToast()
    const router=useRouter();
    const [meetingState,SetMeetingState]=useState<'isScheduledMeeting' | 'isJoiningMeeting' |
    'isInstantMeeting' | undefined>();
    const {user}=useUser();
    const client=useStreamVideoClient();
    const [values,setValues]=useState({
      dateTime: new Date(),
      description:'',
      link:'',
    })
    const [callDetails, setcallDetails] = useState<Call>()

    const createMeeting= async()=>{
      if(!client || !user) return;
      try{
        if(!values.dateTime){
          toast({title:"Please Select a date and time"})
          return;
        }
        const id=crypto.randomUUID();
        const call=client.call('default',id);
        if(!call) throw new Error('Failed to create a meeting');

        const startsAt =values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description=values.description || 'Instant Meeting'
        await call.getOrCreate({
          data:{
            starts_at:startsAt,
            custom:{
              description,
            },
          },
        });
        setcallDetails(call);

        if(!values.description){
          router.push(`/meeting/${call.id}`)
        }
        toast({title:"Meeting Created"})
      }
      catch(error){
        console.log(error)
        toast({
          title: "Failed to create Meeting",
        })
      }
    }
    if (!client || !user) return <Loader />;
    
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
  
    return (
    <section className='grid grid-cp;s-1 gap-5 
    md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
        img='icons/add-meeting.svg'
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={()=>SetMeetingState('isInstantMeeting')}
        className='bg-orange-1'
        />
        <HomeCard 
        img='icons/schedule.svg'
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={()=>{SetMeetingState('isScheduledMeeting')}}
        className='bg-blue-1'
        />
        <HomeCard 
        img='icons/add-meeting.svg'
        title="View Recordings"
        description="Check your meeting recording"
        handleClick={()=>router.push('/recordings')}
        className='bg-purple-1'
        />
        <HomeCard 
        img='icons/join-meeting.svg'
        title="Join Meeting"
        description="via invitation link"
        handleClick={()=>{SetMeetingState('isJoiningMeeting')}}
        className='bg-yellow-1'
        />

{!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduledMeeting'}
          onClose={() => SetMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              // dateFormat="d MMMM, yyyy h:mm aa"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduledMeeting'}
          onClose={() => SetMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => SetMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

        <MeetingModal 
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={()=>SetMeetingState(undefined)}
          title="Start an Instant Meeting"
          className='text-center'
          buttonText="Start Meeting"
          handleClick={createMeeting}

        />
    </section>
  )
}

export default MeetingType