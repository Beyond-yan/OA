package com.gdssoft.oa.service.snconfig.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.snconfig.FileSnConfigOrderDao;
import com.gdssoft.oa.model.snconfig.FileSnConfigOrder;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.snconfig.FileSnConfigOrderService;
import com.gdssoft.oa.service.system.AppUserService;

public class FileSnConfigOrderServiceImpl extends BaseServiceImpl<FileSnConfigOrder> implements FileSnConfigOrderService{
	@SuppressWarnings("unused")
	private FileSnConfigOrderDao dao;
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private AppUserService appUserService;
	
	public FileSnConfigOrderServiceImpl(FileSnConfigOrderDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<FileSnConfigOrder> getAll(QueryFilter filter){
		List<FileSnConfigOrder> list=new ArrayList<FileSnConfigOrder>();
		List<FileSnConfigOrder> configOrderList = dao.getAll(filter);
		for(FileSnConfigOrder configOrder : configOrderList){
			Long flowId=configOrder.getDefId();
			Long userId=configOrder.getUserId();
			if(null!=userId){
				configOrder.setUserName(appUserService.get(userId).getFullname());
			}else{
				configOrder.setUserName("");
			}
		    configOrder.setFlowName(proDefinitionService.get(flowId).getName());
		    list.add(configOrder);
		}
		return list;
	}

}