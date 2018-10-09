package com.gdssoft.oa.service.integration.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.gdssoft.oa.dao.integration.UserPowerDao;
import com.gdssoft.oa.model.integration.FlowAuditLogModel;
import com.gdssoft.oa.service.common.impl.BaseServiceImpl;
import com.gdssoft.oa.service.integration.UserPowerService;

import edu.emory.mathcs.backport.java.util.Arrays;

public class UserPowerServiceImpl extends BaseServiceImpl implements UserPowerService {

	@Autowired
	@Resource(name = "userPowerDao")
	private UserPowerDao userPowerDao;

	private static String statementName = "userPower";
	
	public UserPowerServiceImpl() {
		super(statementName);
	}


	@SuppressWarnings("unchecked")
	@Override
	public List<FlowAuditLogModel> queryAuditLog(Map<String, Object> param) {
		String flowRelateId = (String) param.get("flowRelateId");
		List<String> list = new ArrayList<String>();
		if(StringUtils.isNotBlank(flowRelateId)){
			//list.toArray(flowRelateId.split(","));
			list = Arrays.asList(flowRelateId.split(","));
		}
		param.put("relateId", list);
		return baseDao.queryListSatement(statementName+".queryAuditLog", param);
	}

	public String queryUserName(String userid){
		return userPowerDao.queryUserName(statementName, userid);
	}
	public boolean queryByPoweId(String poweId){
		return userPowerDao.queryByPoweId(statementName, poweId);
	}
}
