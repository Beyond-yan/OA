package com.gdssoft.oa.service.leaderActivities;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;

public interface LeaderActivitiesService extends BaseService<LeaderActivities> {
	List<LeaderActivities> Weileader(String schamal,String startDate, String endDate,
			Long activeId);
	public LeaderActivities findByArchivesIdAndUserId(String schema, Long archivesId, Long userId);
	public int removeActiveByArchiveId(String schema, Long archivesId);
	public int insertArchiveActive(String schemaCode, Long archivesId, Long activeId);
	public int removeArchivesActive(String schemaCode, Long activeId);
	public List<LeaderActivities> findActiveByArchiveId(String schamal, Long archivesId);
	public List<LeaderActivities> findActiveByNoticeIdAndDepId(String schamal, Long noticeId, Long depId);
}
