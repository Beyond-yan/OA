package com.gdssoft.oa.service.meetingTimes.impl;

import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.meetingTimes.MeetingTimesDao;
import com.gdssoft.oa.model.meetingTimes.MeetingTimes;
import com.gdssoft.oa.service.meetingTimes.MeetingTimesService;

public class MeetingTimesServiceImpl extends
		BaseServiceImpl<MeetingTimes> implements MeetingTimesService{
	private MeetingTimesDao meetingTimesDao;
	
	public MeetingTimesServiceImpl(MeetingTimesDao dao) {
		super(dao);
		this.meetingTimesDao = dao;
	}

	@Override
	public List<MeetingTimes> getByCondition(String year, String times, String type) {
		return meetingTimesDao.getByCondition(year, times, type);
	}

	@Override
	public int setTimes(String archivesId, String timesId, String times) {
		return meetingTimesDao.setTimes(archivesId, timesId, times);
	}

	@Override
	public int setTimesAndNo(String archivesId, String num, String timesId, String times) {
		return meetingTimesDao.setTimesAndNo(archivesId, num, timesId, times);
	}

	@Override
	public int setNumber(String archivesId, String number) {
		return meetingTimesDao.setNumber(archivesId, number);
	}

}
