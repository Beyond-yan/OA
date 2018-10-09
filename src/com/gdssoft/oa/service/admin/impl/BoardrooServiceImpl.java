package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.BoardrooDao;
import com.gdssoft.oa.dao.admin.ConferenceDao;
import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.service.admin.BoardrooService;

public class BoardrooServiceImpl extends BaseServiceImpl<Boardroo> implements BoardrooService{
	private BoardrooDao dao;
	@Resource
	private ConferenceDao conferenceDao;
	
	public BoardrooServiceImpl(BoardrooDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<Boardroo> searchBoRoomByTime(Date startTime, Date endTime,int isLong) {
		// TODO Auto-generated method stub
		return dao.searchBoRoomByTime(startTime, endTime,isLong);
	}
	
	public List<Boardroo> listConference(Long roomId, Date startTime, Date endTime){
		List<Boardroo> rooList = new ArrayList<Boardroo>();
		if(-1 != roomId){
			rooList.add(dao.get(roomId));
		}else{
			rooList = dao.getAllOrderCode();
		}
		for(Boardroo roo : rooList){
			
			List<Conference> in_conferences = conferenceDao.getConferenceByRoom(roo.getRoomId(),startTime,endTime);
			if(in_conferences.size()>0){
				roo.setConfs(in_conferences);
				/*Set<Conference> set = new HashSet();
				set.addAll(in_conferences);
				roo.setConferences(set);*/
			}
		}
		return rooList;
	}

/*	@Override
	public List<Boardroo> searchUsedBoRoomByTime(Date startTime, Date endTime) {
		// TODO Auto-generated method stub
		return dao.searchUsedBoRoomByTime(startTime, endTime);
	}
*/

}