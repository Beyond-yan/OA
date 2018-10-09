package com.gdssoft.oa.service.communicate.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.communicate.SmsHistoryDao;
import com.gdssoft.oa.model.communicate.SmsHistory;
import com.gdssoft.oa.service.communicate.SmsHistoryService;

public class SmsHistoryServiceImpl extends BaseServiceImpl<SmsHistory> implements SmsHistoryService{
	private SmsHistoryDao dao;
	
	public SmsHistoryServiceImpl(SmsHistoryDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public List<SmsHistory> findByDepAndTeam(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId){
		List<SmsHistory> list = dao.findByDepAndTeam(depId, teamId, start, size, sendTime, recipients, phoneNumber, userId);
		return list;
	}
	
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId){
		return dao.count(depId, teamId, sendTime, recipients, phoneNumber, userId);
	}
	
	public List<SmsHistory> findByDepAndTeamAll(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId){
		List<SmsHistory> list = dao.findByDepAndTeamAll(depId, teamId, start, size, sendTime, recipients, phoneNumber, userId);
		return list;
	}
	
	public Long countAll(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId){
		return dao.countAll(depId, teamId, sendTime, recipients, phoneNumber, userId);
	}

}