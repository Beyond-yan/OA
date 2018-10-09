package com.gdssoft.oa.dao.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.admin.Boardroo;

/**
 * 
 * @author 
 *
 */
public interface BoardrooDao extends BaseDao<Boardroo>{
	
	/**
	 * @author f3225932
	 * @category 用于查找会议室信息，根据开始时间以及结束时间，查找没有冲突的会议室列表
	 * @param startTime
	 * @param endTime
	 * @return 会议室的列表	
	 * @param isLong 0是短期的会议室   1是长期会议室中的子笔
	 * @return 会议室列表：短期会议室返回的是不存在冲突的会议室列表，长期的返回存在冲突的会议室列表
	 */
	public  List<Boardroo> searchBoRoomByTime(java.util.Date startTime,java.util.Date endTime,int isLong);
	
	public List<Boardroo> listConference(Date startDate, Date endDate);
	
	public List<Boardroo>  getAllOrderCode();
	
	//public List<Boardroo> searchUsedBoRoomByTime(Date startTime, Date endTime) ;
	
}