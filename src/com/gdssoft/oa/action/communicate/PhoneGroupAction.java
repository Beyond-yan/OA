package com.gdssoft.oa.action.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.communicate.PhoneBook;
import com.gdssoft.oa.model.communicate.PhoneGroup;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.communicate.PhoneBookService;
import com.gdssoft.oa.service.communicate.PhoneGroupService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
/**
 * 
 * @author csx
 *
 */
public class PhoneGroupAction extends BaseAction{
	@Resource
	private PhoneGroupService phoneGroupService;
	private PhoneGroup phoneGroup;
	@Resource
	private PhoneBookService phoneBookService;
	private Long groupId;

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public PhoneGroup getPhoneGroup() {
		return phoneGroup;
	}

	public void setPhoneGroup(PhoneGroup phoneGroup) {
		this.phoneGroup = phoneGroup;
	}

	/**
	 * 显示列表
	 */
	public String list(){	
		List<PhoneGroup> list= phoneGroupService.getAll(ContextUtil.getCurrentUserId());
		String method=getRequest().getParameter("method");
		StringBuffer buff = new StringBuffer();
		int i=0;
		if(StringUtils.isNotEmpty(method)){			
			buff.append("[");
		}else{
			i++;
			buff.append("[{id:'"+0+"',text:'联系人分组',expanded:true,children:[");
		}
		for(PhoneGroup pg:list){
			buff.append("{id:'"+pg.getGroupId()+"',text:'"+pg.getGroupName()+"',leaf:true},");
		}
		if (!list.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(i==0){
			buff.append("]");
		}else{
		    buff.append("]}]");
		}
		jsonString=buff.toString();		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				Long groupId=new Long(id);
				PhoneGroup phoneGroup=phoneGroupService.get(groupId);
				phoneGroupService.remove(groupId);
				List<PhoneGroup> list=phoneGroupService.findBySnDown(phoneGroup.getSn(),phoneGroup.getAppUser().getUserId());
				for(PhoneGroup pg:list){
					pg.setSn(pg.getSn()-1);
					phoneGroupService.save(pg);
				}
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	public String count(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<PhoneBook> pbList= phoneBookService.getAll(filter);
		setJsonString("{success:true,count:"+pbList.size()+"}");
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		PhoneGroup phoneGroup=phoneGroupService.get(groupId);
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(phoneGroup));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		AppUser appUser=ContextUtil.getCurrentUser();
		Integer sn=phoneGroupService.findLastSn(appUser.getUserId());
		if(sn==null)sn=0;
		phoneGroup.setAppUser(appUser);		
		phoneGroup.setSn(sn+1);
		phoneGroupService.save(phoneGroup);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String move(){
		String strOpt=getRequest().getParameter("optId");
		String strGroupId=getRequest().getParameter("groupId");
		Long userId=ContextUtil.getCurrentUserId();
		if(StringUtils.isNotEmpty(strGroupId)){
			Integer opt=Integer.parseInt(strOpt);
			Long groupId=Long.parseLong(strGroupId);
			phoneGroup=phoneGroupService.get(groupId);
			Integer sn=phoneGroup.getSn();
			if(opt==1){/*上移*/
				if(sn>1){
					PhoneGroup pg=phoneGroupService.findBySn(sn-1,userId);
					pg.setSn(sn);
					phoneGroupService.save(pg);
					phoneGroup.setSn(sn-1);
					phoneGroupService.save(phoneGroup);
				}
			}
			if(opt==2){//move down
				if(sn<phoneGroupService.findLastSn(userId)){
					PhoneGroup pg=phoneGroupService.findBySn(sn+1,userId);
					pg.setSn(sn);	
					phoneGroup.setSn(sn+1);
					phoneGroupService.save(pg);
					phoneGroupService.save(phoneGroup);
				}
			}
			if(opt==3){//move top
				if(sn>1){
					List<PhoneGroup> list=phoneGroupService.findBySnUp(sn, userId);
					for(PhoneGroup pg:list){
						pg.setSn(pg.getSn()+1);
						phoneGroupService.save(pg);
					}
					phoneGroup.setSn(1);
					phoneGroupService.save(phoneGroup);
				}
			}
			if(opt==4){
				if(sn<phoneGroupService.findLastSn(userId)){
					List<PhoneGroup> list=phoneGroupService.findBySnDown(sn, userId);
					for(PhoneGroup pg:list){
						pg.setSn(pg.getSn()-1);
						phoneGroupService.save(pg);
					}
					phoneGroup.setSn(phoneGroupService.findLastSn(userId)+1);
					phoneGroupService.save(phoneGroup);
				}
			}
			setJsonString("{success:true}");
		}else{
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
}
