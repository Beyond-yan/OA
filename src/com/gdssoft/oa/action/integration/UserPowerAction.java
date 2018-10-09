package com.gdssoft.oa.action.integration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.integration.UserPowerModel;
import com.gdssoft.oa.service.integration.UserPowerService;
import com.google.gson.Gson;

/**
 * 审批日志用户权限管理
 * @author acer
 */
public class UserPowerAction extends BaseAction {
	
	@Resource
	private UserPowerService userPowerService;
	
	/** 初始化数据 **/
	public String list() {
		String userName=getRequest().getParameter("userName");
		String deptName=getRequest().getParameter("deptName");
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("poweUserName", userName);
		paramMap.put("poweDeptName", deptName);
		List<UserPowerModel> userPower = userPowerService.queryList(paramMap);
		int totalCounts =  userPowerService.queryCount(paramMap);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(userPower));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/** 删除用户 **/
	public String del() {
		String[] ids = getRequest().getParameterValues("ids");
		for(String id : ids){
			boolean isdelete= userPowerService.remove(id);
			if(!isdelete){
				setJsonString("{success:true,msg:'用户删除失败'}");
				return SUCCESS;
			}
			System.out.println("====>"+id+"=删除成功！");
		}
		setJsonString("{success:true,msg:''}");		
		return SUCCESS;
	}
	
	/** 新增 **/
	public String append(){
		String PowerUserId = getRequest().getParameter("UserPowerViewUserId");
		String relationUser = getRequest().getParameter("UserPowerViewUserName");
		String powedep = getRequest().getParameter("powedep");
		String poweusername = getRequest().getParameter("poweusername");
		String poweId = getRequest().getParameter("poweId");
		
		if(poweId != null && !poweId.trim().equals("")){//编辑
			if(this.editSave(poweId,PowerUserId,relationUser,powedep,poweusername)){
				setJsonString("{success:true,msg:'用户编辑成功'}");
				return SUCCESS;
			}else{
				setJsonString("{success:true,msg:'用户编辑失败,请联系管理员'}");
				return SUCCESS;
			}
		}
		String userid = userPowerService.queryUserName(PowerUserId);
		
		UserPowerModel UPM = new UserPowerModel();
		UPM.setPoweUserId(userid);
		UPM.setRelationUser(relationUser);
		UPM.setPoweUserName(poweusername);
		UPM.setPoweDeptName(powedep);
		UPM.setPoweItemKey("1111");
		if(!userPowerService.insert(UPM)){
			setJsonString("{success:true,msg:'用户新增失败,请联系管理员'}");
			return SUCCESS;
		}
		setJsonString("{success:true,msg:'用户新增成功'}");
		return SUCCESS;
	}
	
	/** 初始化编辑 **/
	public String edit(){
		String poweid = getRequest().getParameter("poweId");
		UserPowerModel UPM = userPowerService.query(poweid);
		StringBuffer buff = new StringBuffer("{success:true,'result':");
		Gson gson=new Gson();
		buff.append(gson.toJson(UPM));
		buff.append("}");
		
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	/** 保存编辑 **/
	public boolean editSave(String poweId, String PowerUserId, String relationUser, 
							   String powedep, String poweusername){
		UserPowerModel UPM = new UserPowerModel();
		UPM.setPoweId(Integer.parseInt(poweId));
		UPM.setPoweUserId(PowerUserId);
		UPM.setRelationUser(relationUser);
		UPM.setPoweUserName(poweusername);
		UPM.setPoweDeptName(powedep);
		return userPowerService.edit(UPM);
	}
}

