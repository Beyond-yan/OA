package com.gdssoft.oa.dao.leaderActivities;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;

public interface LeaderActivitiesDao extends BaseDao<LeaderActivities> {

	List<LeaderActivities> Weileader(String schamal,String startDate, String endDate,
			Long activeId);
	public int insertArchiveActive(String schemaCode, Long archivesId, Long activeId);

	public int removeArchivesActive(String schemaCode, Long activeId);
	
	public int removeActiveByArchiveId(String schema, Long archivesId);
	
	public LeaderActivities findByArchivesIdAndUserId(String schema, Long archivesId, Long userId);
	
	public List<LeaderActivities> findActiveByArchiveId(String schamal, Long archivesId);
	
	public List<LeaderActivities> findActiveByNoticeIdAndDepId(String schamal, Long noticeId, Long depId);
}
