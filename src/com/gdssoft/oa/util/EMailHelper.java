package com.gdssoft.oa.util;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URL;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Node;

import tebie.applib.api.APIContext;
import tebie.applib.api.IClient;

import com.gdssoft.core.util.PropertiesFileUtil;
import com.gdssoft.oa.model.communicate.Mail;

/**
 * 用于和email server交互
 * @author shizenghua 20140111
 */
public class EMailHelper {
	private static String EMAIL_SERVER = "10.224.5.179";
	private static String EMAIL_SERVER_PORT = "6195";
	private static String EMAIL_SERVER_HTTP = "http://" + EMAIL_SERVER;
	private static Map<String,String> STATUS = null;
	static {
		String server = PropertiesFileUtil.readValue("EMAIL_SERVER_IP");
		if(!"".equals(server) && server != null){
			EMAIL_SERVER = server;
		}
		String port = PropertiesFileUtil.readValue("EMAIL_SERVER_PORT");
		if(!"".equals(port) && port != null){
			EMAIL_SERVER_PORT = port;
		}
		
		EMAIL_SERVER_HTTP = "http://" + EMAIL_SERVER +EMAIL_SERVER_PORT;
		
		STATUS = new HashMap<String,String>();
		STATUS.put("0", "API调用成功，即获取邮件列表成功");
		STATUS.put("0102", "调用者身份验证失败");
		STATUS.put("0103", "域名验证错误");
		
	}
	
	
	private static String getResponseFromUrl(String urlstr,Map<String,String> params)
			throws IOException {
		URL url = new URL(urlstr);
		HttpURLConnection urlConn = (HttpURLConnection) url.openConnection();
		urlConn.setDoOutput(true);
		urlConn.setDoInput(true);
		urlConn.setUseCaches(false);
		urlConn.setConnectTimeout(30000);
		urlConn.setReadTimeout(30000);
		//配置连接的Content-type，配置为application/x- www-form-urlencoded的意思是正文是urlencoded编码过的form参数，下面我们可以看到我们对正文内容使用URLEncoder.encode进行编码
		urlConn.setRequestProperty("Content-type", "application/x-www-form-urlencoded");
		urlConn.setRequestMethod("POST");
		
        StringBuffer sb = new StringBuffer();
		if(params!=null){
			for(Iterator<String> it = params.keySet().iterator();it.hasNext();){
				String key = it.next();
				sb.append(key+"="+URLEncoder.encode(params.get(key), "UTF-8")+"&");
			}
			sb.deleteCharAt(sb.length()-1);
		}
		urlConn.getOutputStream().write(sb.toString().getBytes());
		urlConn.getOutputStream().flush();
		urlConn.getOutputStream().close();
		
		sb = new StringBuffer();
		
		/*BufferedReader reader = new BufferedReader(new InputStreamReader(
				urlConn.getInputStream(),"UTF-8"));
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		reader.close();*/
		int byteread = 0; // 璇诲叆澶氫釜瀛楄妭鍒板瓧鑺傛暟缁勪腑锛宐yteread涓轰竴娆¤鍏ョ殑瀛楄妭鏁�
		byte[] buffer = new byte[2048 * 1024];
		BufferedInputStream fin = new BufferedInputStream(urlConn.getInputStream());
		while ((byteread = fin.read(buffer)) != -1) {
			sb.append(new String(buffer, 0, byteread,"UTF-8"));
		}
		
		urlConn.disconnect();

		return sb.toString();
	}


	/**
	 * <pre>
	 * 	<mail>
	 * 		<msgno>邮件msgno1</msgno>
	 *		<mailbox>所在邮件箱</mailbox>
	 *		<subject>邮件主题1</subject>
	 *		<from>发件人</from>
	 *		<date>发件日期</date>
	 * 		<attachment>是否包含附件,1是有附件,0是没有附件</attachment>
	 *	</mail>
	 * </pre>
	 * @param email
	 * @param mailbox
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<Mail> umail_getFromMailServer(String email,String mailbox) {
		String url = EMAIL_SERVER_HTTP+"/webmail/api.php?do=getMail";
		Map<String,String> params = new HashMap<String,String>();
		params.put("email", email);
		params.put("password", "password00");
		params.put("domain", "cqjt.gov.cn");
		params.put("mailbox", mailbox);//获取邮件的邮件箱名称，多个以逗号连接，其值为空表示获取所有邮件箱的邮件，如INBOX,Sent
		
		
		List<Mail> list = new ArrayList<Mail>();
		Document dom;
		try {
			String docStr = getResponseFromUrl(url,params);
			dom = DocumentHelper.parseText(docStr);
			String status = dom.valueOf("//result/status");
			System.out.println("状态标识:"+status+"="+STATUS.get(status));
			if("0".equals(status)){
				List<Node> nl = dom.selectNodes("//result/data/mail");
				for (Node n : nl) {
					Mail mail = new Mail();
					mail.setFileIds(n.valueOf("msgno"));
					mail.setSubject(n.valueOf("subject"));
					mail.setSender(n.valueOf("from"));
					mail.setSendTimeStr(n.valueOf("date")); //2013-12-27 04:20:25
					mail.setImportantFlag(Short.parseShort(n.valueOf("attachment")));
					list.add(mail);
				}
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return list.size()>5?list.subList(0, 5):list;
	}

	
	/*
	 * <b>COREMAIL</b>
	 * http://10.224.5.179/coremail/XJS/index.jsp?sid=BArwYZcckOiEUmxzlaccziHQNIXuSvgN
	 */
	public static String coremail_service(String cmd,Object args){

        APIContext ret = null;
        IClient cli = null;

        String result = "";
        //String domainName = "cqjt.gov.cn";
        try {
        	Socket socket = new Socket(EMAIL_SERVER, Integer.parseInt(EMAIL_SERVER_PORT));
            cli = APIContext.getClient(socket);
            
            if("login".equals(cmd)){
                ret = cli.userLoginEx((String)args,"face=XJS");
            }else if("newlist".equals(cmd)){
                ret = cli.getNewMailInfos((String)args, "limit=5&format=xml");
            }
            
            if (ret.getRetCode() == 0) {
            	result = ret.getResult();
                //System.out.println("Result: " + result);
            }else{
            	System.out.println("Error: " + ret.getRetCode()+","+ret.getErrorInfo());
            	result = ""+ret.getRetCode();
            }
            
        } catch(Exception e){
        	e.printStackTrace();
        } finally {
        	try {
				cli.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        } 
        
        
        return result;
	}
	
	
	/**
	 * coremail_
	 * @param email
	 * @return
	 */
	public static List<Mail> getFromMailServer(String email,String args) {
		List<Mail> list = new ArrayList<Mail>();
		Document dom;

		try {
			dom = DocumentHelper.parseText(coremail_service("newlist",email));
			List<Node> nl = dom.selectNodes("//root/mail");
			for (Node n : nl) {
				Mail mail = new Mail();
				mail.setMid(n.valueOf("mid"));
				mail.setFileIds(n.valueOf("msid"));
				mail.setSubject(n.valueOf("subject"));
				mail.setSender(n.valueOf("from").replace("<","&lt;").replace(">","&gt;"));
				mail.setSendTimeStr(n.valueOf("date")); //2013-12-27 04:20:25
				//mail.setImportantFlag(Short.parseShort(n.valueOf("flag")));
				list.add(mail);
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	
		return list;
	}
	
	/**
	 * 添加邮件帐号
	 * add by LiuSicen
	 * type:1,有组织且有部门；type:0,有组织无部门
	 */
	public static String coremail_AddUser(Object args,String orgDepId,String userName,String type){
        APIContext ret = null;
        IClient cli = null;
        String result = "";
        try {
        	Socket socket = new Socket(EMAIL_SERVER, Integer.parseInt(EMAIL_SERVER_PORT));
            cli = APIContext.getClient(socket);
            if("1".equals(type)&&null!=orgDepId&&StringUtils.isNotBlank(orgDepId)){
            	ret=cli.createUser("1", "a", (String)args,"domain_name=cqjt.gov.cn"+"&user_status=0&cos_id=1&password=123&true_name="+userName+"&org_unit_id="+orgDepId);
            }else{
            	ret=cli.createUser("1", "a", (String)args,"domain_name=cqjt.gov.cn"+"&user_status=0&cos_id=1&password=123&true_name="+userName);
            }
            if (ret.getRetCode() == 0) {
            	result = ret.getResult();
            }else{
            	System.out.println("Error: " + ret.getRetCode()+","+ret.getErrorInfo());
            	result = ""+ret.getRetCode();
            }
            
        } catch(Exception e){
        	e.printStackTrace();
        } finally {
        	try {
				cli.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        return result;
	}
	/**
	 * 获取未读邮件并进行分页
	 * add by LiuSicen
	 * page:第几页 
	 */
	public static String coremail_unreadList(String page,Object args){
//		String url = "http://10.224.5.179:6195/apiws/services/API/getNewMailInfos";
//		Map<String,String> params = new HashMap<String,String>();
//		params.put("uid", (String)args);
//		params.put("limit", "400");
//		params.put("format", "xml");
//		String docStr="";
//		try {
//			docStr = getResponseFromUrl(url,params);
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		return docStr;
        APIContext ret = null;
        IClient cli = null;
        String result = "";
        try {
        	Socket socket = new Socket(EMAIL_SERVER, Integer.parseInt(EMAIL_SERVER_PORT));
            cli = APIContext.getClient(socket); 
            ret = cli.getNewMailInfos((String)args, "limit="+page+"&format=xml");
            if (ret.getRetCode() == 0) {
            	result = ret.getResult();
            }else{
            	System.out.println("Error: " + ret.getRetCode()+","+ret.getErrorInfo());
            	result = ""+ret.getRetCode();
            }
            
        } catch(Exception e){
        	e.printStackTrace();
        } finally {
        	try {
				cli.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        return result;
	}
	
	/**
	 * 获取未读邮件coremail_
	 * @param email
	 * @return
	 */
	public static List<Mail> getUnReadMail(String email,String args,String page) {
		List<Mail> list = new ArrayList<Mail>();
		Document dom;
		try {
			dom = DocumentHelper.parseText(coremail_unreadList(page,email));
			List<Node> nl = dom.selectNodes("//root/mail");
			for (Node n : nl) {
				Mail mail = new Mail();
				mail.setMid(n.valueOf("mid"));
				mail.setFileIds(n.valueOf("msid"));
				mail.setSubject(n.valueOf("subject"));
				mail.setSender(n.valueOf("from").replace("<","&lt;").replace(">","&gt;"));
				mail.setSendTimeStr(n.valueOf("date")); //2013-12-27 04:20:25
				//mail.setImportantFlag(Short.parseShort(n.valueOf("flag")));
				list.add(mail);
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	/**
	 * 获取未读邮件数
	 * add by LiuSicen
	 * 
	 */
	public static String coremail_count(Object args){
        APIContext ret = null;
        IClient cli = null;
        String result = "";
        try {
        	Socket socket = new Socket(EMAIL_SERVER, Integer.parseInt(EMAIL_SERVER_PORT));
            cli = APIContext.getClient(socket); 
            ret = cli.getAttrs((String)args, "mbox_newmsgcnt");
            if (ret.getRetCode() == 0) {
            	result = ret.getResult();
            }else{
            	System.out.println("Error: " + ret.getRetCode()+","+ret.getErrorInfo());
            	result = ""+ret.getRetCode();
            }
            
        } catch(Exception e){
        	e.printStackTrace();
        } finally {
        	try {
				cli.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        return result;
	}
	
	public static void main(String[] args) {
		/*<ul>
		<li _key="INBOX">
		<li _key="Drafts">
		<li _key="Sent">
		<li _key="Spam">
		<li _key="Trash">
		</ul>*/
		/*List<Mail> list = getFromMailServer("dingyao@cqjt.gov.cn", "INBOX");
		for (Mail mail : list) {
			System.out.println(mail);
		}*/
		
		
		
		System.out.println(coremail_unreadList("100","luojiahong@cqjt.gov.cn"));
		//System.out.println(coremail_AddUser("liusicen","","刘思岑","0"));
		//System.out.println(getFromMailServer("shizenghua@cqjt.gov.cn",null).size());
		
	}
}
