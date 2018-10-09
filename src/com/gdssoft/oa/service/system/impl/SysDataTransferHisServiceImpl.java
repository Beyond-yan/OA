package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysArchivesFilesHisDao;
import com.gdssoft.oa.dao.system.SysDataTransferHisDao;
import com.gdssoft.oa.dao.system.SysDepartmentConfigDao;
import com.gdssoft.oa.model.system.SysDataTransferHis;
import com.gdssoft.oa.model.system.SysDepartmentConfig;
import com.gdssoft.oa.service.system.SysDataTransferHisService;

public class SysDataTransferHisServiceImpl extends BaseServiceImpl<SysDataTransferHis> implements SysDataTransferHisService{
	@SuppressWarnings("unused")
	private SysDataTransferHisDao dao;
	@Resource
	private SysDepartmentConfigDao sysDepartmentConfigDao;
	@Resource
	private SysArchivesFilesHisDao sysArchivesFilesHisDao;
	
	public SysDataTransferHisServiceImpl(SysDataTransferHisDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public SysDataTransferHis getDep(Long id){
		SysDataTransferHis sysDataTransferHis = dao.get(id);
		SysDepartmentConfig sysDepartmentConfig;
		String receiveDep = sysDataTransferHis.getReceiveDep();
		if(null != receiveDep && "" != receiveDep){
			sysDepartmentConfig = sysDepartmentConfigDao.findByDepCode(receiveDep);
			sysDataTransferHis.setConfs(sysDepartmentConfig);
		}
		return sysDataTransferHis;
	}
	
	public void deleteHis(Long hisId){
		List<SysDataTransferHis> list = dao.findByHisId(hisId);
		if(list.size()>0){
			for(int i = 0; i < list.size(); i++){
				sysArchivesFilesHisDao.deleteDataId(list.get(i).getId());
				dao.remove(list.get(i));
			}
		}
	}

}