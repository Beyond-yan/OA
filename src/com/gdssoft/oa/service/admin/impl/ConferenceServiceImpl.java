package com.gdssoft.oa.service.admin.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.admin.ConferenceDao;
import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * @description ConferenceServiceImpl
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public class ConferenceServiceImpl extends BaseServiceImpl<Conference>
		implements ConferenceService {
	private ConferenceDao dao;

	public ConferenceServiceImpl(ConferenceDao dao) {
		super(dao);
		this.dao = dao;
	}

	/**
	 * @description 根据会议标题分页模糊查询
	 */
	@Override
	public List<Conference> getConfTopic(String confTopic, PagingBean pb) {
		return dao.getConfTopic(confTopic, pb);
	}

	/**
	 * @description 根据userId查询对应的fullName,返回fullName组成的字符串
	 * @param userIds
	 *            userId组成的字符串
	 * @return fullName组成的字符串
	 */
	public String baseUserIdSearchFullName(String userIds) {
		return dao.baseUserIdSearchFullName(userIds);
	}

	/**
	 * @description 会议发送,并发送
	 */
	public Conference send(Conference conference, String view, String updater,
			String summary, String fileIds) {
		conference.setCreatetime(new Date());
		conference.setSendtime(new Date());
		return dao.send(conference, view, updater, summary, fileIds);
	}

	/**
	 * @description 会议暂存
	 */
	public Conference temp(Conference conference, String view, String updater,
			String summary, String fileIds) {
		// 修改状态0
		conference.setStatus((short) 0);
		conference.setCreatetime(new Date());// 获取当前时间
		return dao.temp(conference, view, updater, summary, fileIds);
	}

	/**
	 * @description 根据会议室编号判断在输入的时间段内是否会议室可用,可用返回success,不可用返回不可用的时间段
	 */
	@Override
	public String judgeBoardRoomNotUse(Long confId,Date startTime, Date endTime, Long roomId, Date confStartTime, Date confEndTime) {
		return dao.judgeBoardRoomNotUse(confId,startTime, endTime, roomId, confStartTime, confEndTime);
	}

	/**
	 * @description 会议审批操作
	 */
	@Override
	public String apply(Long confId, String checkReason, boolean bo) {
		return dao.apply(confId, checkReason, bo);
	}

	@Override
	public List<Conference> getPicBoardRoom(Date startTime, Date endTime,Long roomId) {
		// TODO Auto-generated method stub
		return dao.getPicBoardRoom(startTime, endTime, roomId);
	}

	@Override
	public List<Conference> getLongConfSub(Long parentConfId) {
		// TODO Auto-generated method stub
		return dao.getLongConfSub(parentConfId);
	}

	@Override
	public String delSubConf(Long parentConfId) {
		// TODO Auto-generated method stub
		return dao.delSubConf(parentConfId);
		
	}

	@Override
	public List<Conference> getDaibanConf(String empId) {
		// TODO Auto-generated method stub
		return dao.getDaibanConf(empId);
	}
	
	public boolean getBoardRoomNotUse(Long confId, Date startTime,
			Date endTime, Integer timeType,Long roomId) {
		return dao.getBoardRoomNotUse(confId, startTime, endTime, timeType, roomId);
	}
	/**
	 * 自动更新schema下的会议
	 * @param schemaCode
	 * @param status
	 * @param conferenceId
	 * @param updateUser
	 */
	public void updateConferenceStatus(String schemaCode,int status,String updateUser){
		dao.updateConferenceStatus(schemaCode, status, updateUser);
	}
}