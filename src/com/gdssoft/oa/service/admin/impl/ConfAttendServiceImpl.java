package com.gdssoft.oa.service.admin.impl;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.ConfAttendDao;
import com.gdssoft.oa.model.admin.ConfAttend;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.ConfAttendService;
import com.gdssoft.oa.service.system.AppUserService;

/**
 * @description ConfAttendServiceImpl
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public class ConfAttendServiceImpl extends BaseServiceImpl<ConfAttend>
		implements ConfAttendService {
	private ConfAttendDao dao;
	
	@Resource
	private AppUserService appUserService;

	public ConfAttendServiceImpl(ConfAttendDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public List<ConfAttend> getConfAt(Long confID) {
		return dao.getConfAt(confID);
	}
	
	public void delete(Long confId){
		dao.delete(confId);
	}

	@Override
	public List<AppUser> fliterLeader(String userIds) {
		List<AppUser> aus = new ArrayList<AppUser>();
		
		for(String userIdStr : userIds.split("[,]")){
			AppUser au = appUserService.get(Long.parseLong(userIdStr));
			if(au!=null){
				if(au.getDepartment().getDepId()==100406){
					aus.add(au);
				}
			}
		}
		
		return aus;
	}
	
	
	

}