package com.gdssoft.oa.service.communicate;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.communicate.SmsHistory;
import com.gdssoft.core.service.BaseService;

public interface SmsHistoryService extends BaseService<SmsHistory>{
	
	public List<SmsHistory> findByDepAndTeam(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId);
	
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId);
	
	//全部数据
	public List<SmsHistory> findByDepAndTeamAll(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId);
	public Long countAll(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId);
}


