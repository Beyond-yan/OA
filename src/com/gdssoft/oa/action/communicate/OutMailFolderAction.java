package com.gdssoft.oa.action.communicate;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import com.gdssoft.oa.model.communicate.OutMail;
import com.gdssoft.oa.model.communicate.OutMailFolder;
import com.gdssoft.oa.service.communicate.OutMailFolderService;
import com.gdssoft.oa.service.communicate.OutMailService;
import com.google.gson.Gson;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;



/**
 * 
 * @author 
 *
 */
public class OutMailFolderAction extends BaseAction{
	static long FOLDER_ID_RECEIVE = 1;//收件箱
	static long FOLDER_ID_SEND = 2;//发件箱
	static long FOLDER_ID_DRAFT = 3;//草稿箱
	static long FOLDER_ID_DELETE = 4;//删除箱
	static long FOLDER_TYPE_OTHER = 10;//其它类型文件夹
	static short OTHER_FOLDER_TYPE =(short)10;//其它类型文件夹
	
	static int   FIRST_LEVEL = 1;//第一层
	static long  FIRST_PARENTID =new Long(0);//第一层文件夹的parentId

	
	@Resource
	private OutMailFolderService outMailFolderService;
	private OutMailFolder outMailFolder;
	@Resource
	private OutMailService outMailService;	
	private OutMail outMail;
	
	private Long folderId;


	public Long getFolderId() {
		return folderId;
	}

	public void setFolderId(Long folderId) {
		this.folderId = folderId;
	}

	public OutMailFolder getOutMailFolder() {
		return outMailFolder;
	}

	public void setOutMailFolder(OutMailFolder outMailFolder) {
		this.outMailFolder = outMailFolder;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		

		
		StringBuffer buff = new StringBuffer("[{id:'"+0+"',text:'外部邮箱',iconCls:'menu-mail_box',expanded:true,children:[");
		Long curUserId=ContextUtil.getCurrentUserId();
		List<OutMailFolder> outMailFolderList=outMailFolderService.getAllUserFolderByParentId(curUserId, FIRST_PARENTID);//最顶层父节点
		
		for(OutMailFolder folder:outMailFolderList){
			long folderType = folder.getFolderId();
			
			
			buff.append("{id:'"+folder.getFolderId()).append("',text:'"+folder.getFolderName()).append("',");
			
			if(folderType == FOLDER_ID_RECEIVE){//收件箱图标
				buff.append("iconCls:'menu-mail_inbox',");
			}else if(folderType == FOLDER_ID_SEND){//发件箱图标
				buff.append("iconCls:'menu-mail_outbox',");
			}else if(folderType == FOLDER_ID_DRAFT){//草稿箱图标
				buff.append("iconCls:'menu-mail_drafts',");
			}else if(folderType == FOLDER_ID_DELETE){//垃圾箱图标
				buff.append("iconCls:'menu-mail_trash',");
			}else {//其他文件夹图标
				buff.append("iconCls:'menu-mail_folder',");
			}
		    buff.append(findChildsFolder(curUserId,folder.getFolderId()));
		   
		}
		if (!outMailFolderList.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]}]");
		setJsonString(buff.toString());
		
		
		
		return SUCCESS;
	
	}
	
	/**
	 * 找到下级结点
	 */
	private String findChildsFolder(Long userId,Long parentId){
		StringBuffer sb=new StringBuffer();
		List<OutMailFolder> folders=outMailFolderService.getUserFolderByParentId(userId, parentId);
		if(folders.size()==0){
			sb.append("leaf:true,expanded:true},");
			return sb.toString(); 
		}else {
			sb.append("children:[");
			for(OutMailFolder folder:folders){				
				sb.append("{id:'"+folder.getFolderId()+"',text:'"+folder.getFolderName()+"',");
				sb.append("iconCls:'menu-mail_folder',");//文件夹图标
				sb.append(findChildsFolder(userId,folder.getFolderId()));
			}
			sb.deleteCharAt(sb.length() - 1);
			sb.append("]},");
			return sb.toString();
		}
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				outMailFolderService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		OutMailFolder outMailFolder=outMailFolderService.get(folderId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(outMailFolder));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		
		
		OutMailFolder parentFolder = null;
		System.out.println("outMailFolder="+outMailFolder);
		Long parentId = outMailFolder.getParentId();
		System.out.println(parentId);
		if(parentId == null || parentId== FIRST_PARENTID){
			outMailFolder.setParentId(new Long(FIRST_PARENTID));
			outMailFolder.setDepLevel(FIRST_LEVEL);
			System.out.println("11111outMailFolder"+outMailFolder);
		}else{
			parentFolder = outMailFolderService.get(parentId);
			outMailFolder.setDepLevel(parentFolder.getDepLevel()+1);
			System.out.println("2222outMailFolder"+outMailFolder);
			System.out.println("2222parentFolder"+parentFolder);
		}
		outMailFolder.setFolderType(OTHER_FOLDER_TYPE);
		outMailFolder.setUserId(ContextUtil.getCurrentUserId());
		outMailFolderService.save(outMailFolder);
		
		//保存后获得folderId，根据folderId设置path
		if(outMailFolder.getParentId()==FIRST_PARENTID){
			outMailFolder.setPath("0."+outMailFolder.getFolderId()+".");
		}else{
			outMailFolder.setPath(parentFolder.getPath()+outMailFolder.getFolderId()+".");
		}
		outMailFolderService.save(outMailFolder);
		setJsonString("{success:true}"); 
		return SUCCESS;
		
	
	}
	
	/**
	 * 删除文件
	 * @return
	 */
	public String remove(){
		String count=getRequest().getParameter("count");
		if(folderId!=null){
			OutMailFolder tmpFolder=outMailFolderService.get(new Long(folderId));
			//取得这个目录下的所有下级目录
			List<OutMailFolder> outMailFolderList=outMailFolderService.getFolderLikePath(tmpFolder.getPath());
			
			//假如文件夹中的邮件数大于0,则把邮件转到删除箱中
			if(count!=null&&new Long(count)>0){
				OutMailFolder deleteFolder = outMailFolderService.get(new Long(FOLDER_ID_DELETE));//获得删除箱
				for(OutMailFolder folder : outMailFolderList){
					List<OutMail> outMailList = outMailService.findByFolderId(folder.getFolderId());
					for(OutMail outMail : outMailList){
						outMail.setOutMailFolder(deleteFolder);
						outMailService.save(outMail);
					}
				}
			}
			
			//批量删除其下的目录
			for(OutMailFolder folder:outMailFolderList){
				outMailFolderService.remove(folder.getFolderId());
			}
		}
		
		jsonString="{success:true}";
		return SUCCESS;
	}
	/**
	 * 删除文件夹时查询出该文件夹及其子文件夹的邮件数
	 * @return
	 */
	public String count(){
		OutMailFolder tmpFolder=outMailFolderService.get(new Long(folderId));
		List<OutMailFolder> outMailFolderList=outMailFolderService.getFolderLikePath(tmpFolder.getPath());
		//查询出该目录及其子目录下的邮件数
		Long total = 0l;
		for (OutMailFolder folder : outMailFolderList){
			Long count = outMailService.CountByFolderId(folder.getFolderId());
			total += count ;
		}
		
		setJsonString("{success:true,count:"+total+"}");
		return SUCCESS;
	}
	
}
