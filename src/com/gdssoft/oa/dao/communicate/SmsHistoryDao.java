package com.gdssoft.oa.dao.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.communicate.SmsHistory;

/**
 * 
 * @author 
 *
 */
public interface SmsHistoryDao extends BaseDao<SmsHistory>{
	
	public List<SmsHistory> findByDepAndTeam(Long depId,Long teamId, int start, int size,Date sendTime, String recipients, String phoneNumber, long userId);
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId);
	
	//全部数据
	public List<SmsHistory> findByDepAndTeamAll(Long depId,Long teamId, int start, int size,Date sendTime, String recipients, String phoneNumber, long userId);
	public Long countAll(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId);
	
}