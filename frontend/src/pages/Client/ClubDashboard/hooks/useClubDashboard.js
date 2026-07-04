import { useState, useEffect } from 'react';
import axiosInstance from '../../../../api/axiosInstance';

const useClubDashboard = (clubId) => {
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('member');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [targets, setTargets] = useState([]);
  const [members, setMembers] = useState([]);
  const [momFiles, setMomFiles] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [blockStatus, setBlockStatus] = useState(null);

  useEffect(() => {
    if (clubId) localStorage.setItem("ClubId", clubId);
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    const fetchClubInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const userEmail = localStorage.getItem('email');
        const response = await axiosInstance.get(`/club/${clubId}?email=${userEmail}`);
        const data = response.data;
        setClubInfo({
          id: data.club_id, name: data.club_name, description: data.description,
          category: data.category, memberCount: data.member_count,
          foundedDate: data.founded_date, clubHead: data.club_head,
          email: data.club_email, socialMedia: data.social_media,
          website: data.website, logoUrl: data.logo_url, status: data.status
        });
        setRole(data.userRole || 'member');
        setMembers(data.members || []);
      } catch (err) {
        console.error('Error fetching club info:', err);
        setError('Failed to load club information');
      } finally {
        setLoading(false);
      }
    };
    fetchClubInfo();
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    axiosInstance.get(`/api/clubs/${clubId}/block-status`)
      .then(r => setBlockStatus(r.data))
      .catch(err => console.error('Error fetching block status:', err));
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    axiosInstance.get(`/api/club/${clubId}/announcements`)
      .then(r => setAnnouncements(r.data.map(item => ({
        id: item.item_id, title: item.title, content: item.description,
        author: item.author_name || 'Club Admin',
        date: new Date(item.created_at).toISOString().split('T')[0],
        priority: item.priority, status: item.status
      }))))
      .catch(err => console.error('Error fetching announcements:', err));
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    axiosInstance.get(`/api/club/${clubId}/events`)
      .then(r => setEvents(r.data.map(item => ({
        id: item.item_id, title: item.title, description: item.description,
        date: item.start_date, endDate: item.end_date,
        status: item.status, priority: item.priority
      }))))
      .catch(err => console.error('Error fetching events:', err));
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    axiosInstance.get(`/api/club/${clubId}/targets`)
      .then(r => setTargets(r.data.map(item => {
        const match = item.description?.match(/(\d+)/g);
        return {
          id: item.item_id, title: item.title, current: 0,
          target: match ? parseInt(match[match.length - 1]) : 100,
          deadline: item.end_date, status: item.status,
          priority: item.priority, description: item.description
        };
      })))
      .catch(err => console.error('Error fetching targets:', err));
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    axiosInstance.get(`/api/moms/${clubId}`)
      .then(r => setMomFiles(r.data.map(mom => ({
        id: mom.mom_id, name: mom.meeting_title,
        date: new Date(mom.meeting_date).toISOString().split('T')[0],
        size: '2.3 MB', type: 'MoM'
      }))))
      .catch(err => console.error('Error fetching MoMs:', err));
  }, [clubId]);

  useEffect(() => {
    if (!clubId || role !== 'Coordinator') return;
    axiosInstance.get(`/api/club/${clubId}/join-requests`)
      .then(r => setJoinRequests(r.data.map(req => ({
        id: req.client_id, name: req.full_name,
        email: req.email || req.mail,
        message: req.request_reason || 'No message provided',
        date: new Date(req.joined_at).toISOString().split('T')[0]
      }))))
      .catch(err => console.error('Error fetching join requests:', err));
  }, [clubId, role]);

  const refreshAnnouncements = () =>
    axiosInstance.get(`/api/club/${clubId}/announcements`)
      .then(r => setAnnouncements(r.data.map(item => ({
        id: item.item_id, title: item.title, content: item.description,
        author: item.author_name || 'Club Admin',
        date: new Date(item.created_at).toISOString().split('T')[0],
        priority: item.priority, status: item.status
      }))));

  const refreshEvents = () =>
    axiosInstance.get(`/api/club/${clubId}/events`)
      .then(r => setEvents(r.data.map(item => ({
        id: item.item_id, title: item.title, description: item.description,
        date: item.start_date, endDate: item.end_date,
        status: item.status, priority: item.priority
      }))));

  const refreshTargets = () =>
    axiosInstance.get(`/api/club/${clubId}/targets`)
      .then(r => setTargets(r.data.map(item => {
        const match = item.description?.match(/(\d+)/g);
        return {
          id: item.item_id, title: item.title, current: 0,
          target: match ? parseInt(match[match.length - 1]) : 100,
          deadline: item.end_date, status: item.status,
          priority: item.priority, description: item.description
        };
      })));

  const refreshMembers = () =>
    axiosInstance.get(`/club/${clubId}?email=${localStorage.getItem('email')}`)
      .then(r => setMembers(r.data.members || []));

  const refreshBlockStatus = () =>
    axiosInstance.get(`/api/clubs/${clubId}/block-status`)
      .then(r => setBlockStatus(r.data));

  return {
    clubInfo, setClubInfo, loading, error, role,
    announcements, events, targets, members, setMembers,
    momFiles, joinRequests, setJoinRequests, blockStatus,
    setTargets,
    refreshAnnouncements, refreshEvents, refreshTargets,
    refreshMembers, refreshBlockStatus
  };
};

export default useClubDashboard;