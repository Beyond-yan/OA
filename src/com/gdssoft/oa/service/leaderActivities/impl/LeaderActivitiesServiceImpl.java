package com.gdssoft.oa.service.leaderActivities.impl;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.leaderActivities.LeaderActivitiesDao;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.service.leaderActivities.LeaderActivitiesService;

public class LeaderActivitiesServiceImpl extends
		BaseServiceImpl<LeaderActivities> implements LeaderActivitiesService {
	private LeaderActivitiesDao leaderActivitiesDao;

	public LeaderActivitiesServiceImpl(LeaderActivitiesDao dao) {
		super(dao);
		this.leaderActivitiesDao = dao;
	}

	@Override
	public List<LeaderActivities> Weileader(String schamal,String startDate, String endDate,
			Long activeId) {
		return leaderActivitiesDao.Weileader(schamal,startDate, endDate, activeId);
	}

	@Override
	public LeaderActivities findByArchivesIdAndUserId(String schema, Long archivesId, Long userId) {
		return leaderActivitiesDao.findByArchivesIdAndUserId(schema,archivesId, userId);
	}

	@Override
	public int insertArchiveActive(String schemaCode, Long archivesId, Long activeId) {
		return leaderActivitiesDao.insertArchiveActive(schemaCode, archivesId, activeId);
	}

	@Override
	public int removeArchivesActive(String schemaCode, Long activeId) {
		return leaderActivitiesDao.removeArchivesActive(schemaCode, activeId);
	}

	@Override
	public int removeActiveByArchiveId(String schema, Long archivesId) {
		return leaderActivitiesDao.removeActiveByArchiveId(schema, archivesId);
	}
	
	@Override
	public List<LeaderActivities> findActiveByArchiveId(String schamal, Long archivesId){
		return leaderActivitiesDao.findActiveByArchiveId(schamal, archivesId);
	}

	@Override
	public List<LeaderActivities> findActiveByNoticeIdAndDepId(String schamal, Long noticeId, Long depId){
		return leaderActivitiesDao.findActiveByNoticeIdAndDepId(schamal, noticeId, depId);
	}
}
