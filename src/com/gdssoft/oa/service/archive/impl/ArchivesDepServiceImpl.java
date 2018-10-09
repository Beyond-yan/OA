package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.ArchivesDepDao;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;

public class ArchivesDepServiceImpl extends BaseServiceImpl<ArchivesDep> implements ArchivesDepService{
	private ArchivesDepDao dao;
	@Resource
	private DepartmentService departmentService;
	
	@Resource
	private AppUserService appUserService;
	public ArchivesDepServiceImpl(ArchivesDepDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<ArchivesDep> getSentArchsByArchId(Long archivesId){
		return dao.getSentArchsByArchId(archivesId);
	}
	@Override
	public void updateDownload(String archivesId,String userId) {
		// TODO Auto-generated method stub
		AppUser au=appUserService.get(Long.valueOf(userId));
		Department curDep=au.getDepartment();
		Department dep=departmentService.get3LevelDept(curDep);
		List<ArchivesDep> list=dao.getByArchAndDep(Long.valueOf(archivesId),dep.getDepId());
		
		for(ArchivesDep ad:list){
			ad.setStatus((short) 1);
			ad.setSignFullname(au.getFullname());
			ad.setSignTime(new Date());
			ad.setSignUserID(au.getUserId());
			dao.save(ad);
		}
	}
}