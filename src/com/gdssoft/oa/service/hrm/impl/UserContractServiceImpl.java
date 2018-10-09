package com.gdssoft.oa.service.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.hrm.UserContractDao;
import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.model.hrm.UserContract;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.hrm.UserContractService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.AppUtil;

public class UserContractServiceImpl extends BaseServiceImpl<UserContract> implements UserContractService{
	private UserContractDao dao;
	
	@Resource
	private AppUserDao appUserDao;
	@Resource
	private ShortMessageService shortMessageService;
	
	public UserContractServiceImpl(UserContractDao dao) {
		super(dao);
		this.dao=dao;
	}
    
	public boolean checkContractNo(String contractNo){
		return dao.checkContractNo(contractNo);
	}

	@Override
	public List<UserContract> findTime(Long contractId) {
		return dao.findTime(contractId);
	}

	@Override
	public void sendContractTime() {
		List<UserContract> list=dao.findByExpireDate();
		if(list.size()>0){
			StringBuffer sb=new StringBuffer("合同信息：");
			for(UserContract contract:list){
			   if(contract.getStatus()==2){
				 sb.append(contract.getContractType()+"已经终止合同.");
			   }else{
				 sb.append(contract.getContractType()+"合同快要到期了.");
			   }
			}
			sb.append("上司请提前提醒员工合同到期信息");
		Map map=AppUtil.getSysConfig();
		String username=(String)map.get("userContractStockUser");
		if(StringUtils.isNotEmpty(username)){
			AppUser user=appUserDao.findByUserName(username);
			if(user!=null){
				shortMessageService.save(AppUser.SYSTEM_USER,user.getUserId().toString(), sb.toString(),ShortMessage.MSG_TYPE_SYS);
				logger.info("messages had sent to the manager!"+user.getUsername());
			}else{
				logger.info("can not find the user in the system.");
			}
		}else{
			logger.info("can not find the name in the map.");
		}
		logger.info(sb.toString());
		}else{
			logger.info("没有续约合同.");
		}
		
	}
}