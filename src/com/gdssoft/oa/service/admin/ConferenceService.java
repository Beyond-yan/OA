package com.gdssoft.oa.service.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * @description ConferenceService
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public interface ConferenceService extends BaseService<Conference> {

	/**
	 * @description 根据会议标题分页模糊查询
	 */
	List<Conference> getConfTopic(String confTopic, PagingBean pb);

	/**
	 * @description 根据userId查询对应的fullName，返回fullName组成的字符串
	 */
	String baseUserIdSearchFullName(String userIds);

	/**
	 * @description 会议发送
	 */
	Conference send(Conference conference, String view, String updater,
			String summary, String fileIds);

	/**
	 * @description 会议暂存
	 */
	Conference temp(Conference conference, String view, String updater,
			String summary, String fileIds);

	/**
	 * @description 根据会议室编号判断在输入的时间段内是否会议室可用,可用返回success,不可用返回不可用的时间段
	 * @param startTime
	 *            开始时间
	 * @param endTime
	 *            结束时间
	 * @param roomId
	 *            会议室编号
	 * @return 可用返回success,不可用返回不可用的时间段
	 */
	String judgeBoardRoomNotUse(Long confId,java.util.Date startTime,
			java.util.Date endTime, Long roomId, java.util.Date confStartTime, java.util.Date confEndTime);
	
	boolean getBoardRoomNotUse(Long confId,Date startTime, Date endTime,Integer timeType, Long roomId);

	/**
	 * @description 会议审批，只是修改会议状态
	 * @param confId
	 *            会议编号
	 * @param checkReason
	 *            审核原因
	 * @param bo
	 *            true:审核通过,false:审核失败
	 * @return 成功:success,失败：failure
	 */
	String apply(Long confId, String checkReason, boolean bo);
	
	List<Conference> getPicBoardRoom(Date startTime, Date endTime, Long roomId);

	/**	 
	 * @author xintong
	 * @category 根据父会议Id获取长期会议的子会议列表
	 * @param parentConfId 长期会议的父会议的Id
	 * @return 会议列表
	 */
	List<Conference> getLongConfSub(Long parentConfId);
	
	/**
	 * @author xintong
	 * @category 调整长期会议室，删除未参加的子会议的记录
	 * @param parentConfId 父会议的会议Id
	 * @return msg 成功返回：success 失败返回：操作失败
	 */
	String delSubConf(Long parentConfId);
	
	List<Conference>  getDaibanConf(String empId);
	/**
	 * 自动更新schema下的会议
	 * @param schemaCode
	 * @param status
	 * @param conferenceId
	 * @param updateUser
	 */
	public void updateConferenceStatus(String schemaCode,int status,String updateUser);
	
}
